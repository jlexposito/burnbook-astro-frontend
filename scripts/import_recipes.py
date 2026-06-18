from argparse import ArgumentParser
from pathlib import Path
from string import Template
from urllib.parse import urljoin

import json
import re
import requests
import shutil
import unicodedata
import yaml

ROOT = Path(__file__).resolve().parent.parent

ASSET_INDEX_PATH = ROOT / "astro/src/content/_asset-index.json"


def remove_non_ascii_normalized(string: str) -> str:
	normalized = unicodedata.normalize('NFD', string)
	return normalized.encode('ascii', 'ignore').decode('utf8').casefold()

def slugify(s):
	s = remove_non_ascii_normalized(s)
	s = s.lower().strip()
	s = re.sub(r'[^\w\s-]', '', s)
	s = re.sub(r'[\s_-]+', '-', s)
	s = re.sub(r'^-+|-+$', '', s)
	return s


def add_asset(asset_index, slug, title, image_urls):
	images = []
	for img_url in image_urls:
		filename = normalize_filename(img_url)
		images.append({
			"id": filename,
			"source": img_url,
			"filename": filename
		})
	asset_index["recipes"].append({
		"slug": slug,
		"title": title,
		"images": images
	})


def normalize_filename(url: str):
    return url.split("?")[0].split("/")[-1].strip()

def write_asset_index(asset_index):
    ASSET_INDEX_PATH.write_text(json.dumps(asset_index, indent=2))


class Logger:
	def __init__(self, verbose=False):
		self.verbose = verbose

	def log(self, msg, level='success'):
		if level == 'info':
			msg = f'[*] {msg}'
		elif level == 'error':
			msg = f'[!] {msg}'
		else:
			msg = f'[+] {msg}'

		if self.verbose:
			print(msg)
		elif level != 'info':
			print(msg)

	def info(self, msg):
		self.log(msg, level='info')

	def success(self, msg):
		self.log(msg, level='success')

	def error(self, msg):
		self.log(msg, level='error')



tpl = """\
---
${frontmatter}\
---
${content}
"""

API = 'https://burnbookapi.fauno.nl/'
IMAGE_OUTPUT_DIR = Path(__file__).absolute().parent / "output" / "images"

def get_recipes(logger):
	url = urljoin(API, '/recipes/')
	response = requests.get(url)
	if response.status_code == 200:
		return response.json()
	else:
		logger.error(f'Failed to fetch recipes from API. Using {url}')
		logger.info(f'Request failed with status code {response.status_code}')
		logger.info(f'Response {response.text}')
		exit(2)

def download_image(image_url, output_folder, logger):
	image_filename = image_url.split('/')[-1]
	image_dir = Path(output_folder)
	image_path = output_folder / image_filename
	print(f"Downloading image from {image_url} to {image_path}")
	print(f"Image exists {image_path.exists()}")
	if image_path.exists():
		logger.success(f"Skipping existing image: {image_path}")
		return
	
	response = requests.get(image_url, stream=True)
	if response.status_code == 200:
		with open(image_path, 'wb') as f:
			shutil.copyfileobj(response.raw, f)
		logger.success(f'Successfully downloaded image: {image_path}')
	else:
		logger.error(f'Failed to download image: {image_url} (status code: {response.status_code})')

def cleanup_output_folder(output_folder, logger):
	if output_folder.exists():
		shutil.rmtree(output_folder)
		logger.success(f'Successfully removed all files in {output_folder}')
	else:
		logger.info(f'Output folder {output_folder} does not exist, skipping cleanup')

def run():
	parser = ArgumentParser(
		prog='JSON2Md',
		description='Converts json objects to markdown',
	)
	parser.add_argument(
		"--output-dir",
		type=lambda p: Path(p).absolute(),
		default=Path(__file__).absolute().parent / "output",
		help="Path to the output directory",
	)
	parser.add_argument(
		"--image-dir",
		type=lambda p: Path(p).absolute(),
		default=Path(__file__).absolute().parent / "images",
		help="Path to the output directory",
	)
	parser.add_argument(
		'--dirty',
		action='store_true',
		help='Keep old files in output directory before writing to it'
	)
	parser.add_argument(
		'--verbose',
		action='store_true',
		help='Verbose output'
	)
	args = parser.parse_args()
	logger = Logger(args.verbose)

	output_folder = args.output_dir
	image_folder = args.image_dir
	logger.info(f'Output folder: {output_folder}')
	logger.info(f'Image folder: {image_folder}')

	if not args.dirty:
		cleanup_output_folder(output_folder, logger)
		cleanup_output_folder(image_folder, logger)

	output_folder.mkdir(exist_ok=True)
	image_folder.mkdir(exist_ok=True)
	logger.success('Successfully created output directories')

	asset_index = {
		"recipes": []
	}

	recipes = get_recipes(logger)
	template = Template(tpl)

	for recipe in recipes:
		# Remove instructions and add it as the body
		content = recipe.get('instructions')
		title = recipe.get('title', '')
		image_urls = []
		image_path = recipe.get('image', '')
		if image_path:
			image_url = urljoin(
				API,
				recipe.get('image', '')
			)
			image_urls.append(image_url)
		del recipe['instructions']

		frontmatter = (yaml.dump(recipe, default_flow_style=False, allow_unicode=True))

		markdown = template.substitute(
			frontmatter=frontmatter,
			content=content,
		)
		slug = slugify(title)
		filename = f'{slug}.md'
		file_path = output_folder.joinpath(filename)
		logger.info(f'Output path: {file_path}')

		with open(file_path, 'w') as f:
			f.write(markdown)
		
		add_asset(
			asset_index, 
			slug, 
			title, 
			image_urls
		)
	write_asset_index(asset_index)
	logger.success(f'✓ {len(recipes)} recipes successfully imported')


if __name__ == '__main__':
	run()
