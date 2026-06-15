from pathlib import Path

import json
import os
import requests

ROOT = Path(__file__).resolve().parent.parent

ASSET_INDEX_PATH = ROOT / "astro/src/content/_asset-index.json"
ASSET_MAP_PATH = ROOT / "astro/src/assets/asset-map.json"
# IMPORTANT:
# this is now a WORKSPACE folder, NOT git-tracked
ORIGINALS_DIR = Path(os.getenv(
    "ASSET_WORKSPACE",
    str(ROOT / ".cache/originals")
))

def normalize_filename(url: str):
    return url.split("?")[0].split("/")[-1].strip()


def download(url: str, dest: Path):
    dest.parent.mkdir(parents=True, exist_ok=True)

    with requests.get(url, timeout=60, stream=True) as r:
        r.raise_for_status()

        with open(dest, "wb") as f:
            for chunk in r.iter_content(1024 * 256):
                if chunk:
                    f.write(chunk)


def main():
    if not ASSET_INDEX_PATH.exists():
        raise RuntimeError("Run Stage 1 first")

    index = json.loads(ASSET_INDEX_PATH.read_text())

    asset_map = {}
    print(f'[*] Downloading assets in {ORIGINALS_DIR}')

    for recipe in index.get("recipes", []):
        for img in recipe.get("images", []):

            url = img["source"]
            filename = normalize_filename(url)

            dest = ORIGINALS_DIR / filename

            if dest.is_file():
                print(f"↷ skip {filename}")
            else:
                print(f"↓ download {filename}")
                download(url, dest)

            asset_map[filename] = {
                "source": url
            }

    ASSET_MAP_PATH.write_text(json.dumps(asset_map, indent=2))


if __name__ == "__main__":
    main()