from string import Template
from pathlib import Path
from argparse import ArgumentParser

import re
import requests
import shutil
import unicodedata
import yaml


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

def get_recipes():
	url = f'{API}/recipes/'
	response = requests.get(url)
	if response.status_code == 200:
		return response.json()
	else:
		print('Request failed with status code', response.status_code)
		exit(2)

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
	logger.info(f'Output folder: {output_folder}')

	if not args.dirty and output_folder.exists():
		shutil.rmtree(output_folder)
		logger.success(f'Successfully removed all files in {output_folder}')

	output_folder.mkdir(exist_ok=True)
	logger.success('Successfully created output directory')

	recipes = get_recipes()
	template = Template(tpl)

	for recipe in recipes:
		# Remove instructions and add it as the body
		content = recipe.get('instructions')
		del recipe['instructions']

		frontmatter = (yaml.dump(recipe, default_flow_style=False, allow_unicode=True))

		markdown = template.substitute(
			frontmatter=frontmatter,
			content=content,
		)

		slug = slugify(recipe.get('title'))
		filename = f'{slug}.md'
		file_path = output_folder.joinpath(filename)
		logger.info(f'Output path: {file_path}')

		with open(file_path, 'w') as f:
			f.write(markdown)
	logger.success('Recipes successfully imported')


if __name__ == '__main__':
	run()
