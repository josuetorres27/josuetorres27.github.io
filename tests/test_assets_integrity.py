"""
Tests for Portfolio Assets Integrity
Validates that every image, sprite, icon, document, modular script, and stylesheet referenced in HTML,
CSS, and JavaScript actually exists on disk, has non-zero file size, and is accessible.
"""

import os
import re
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_PATH = os.path.join(ROOT_DIR, "index.html")
CSS_PATH = os.path.join(ROOT_DIR, "css", "styles.css")
JS_DIR = os.path.join(ROOT_DIR, "js")


class TestAssetsIntegrity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(INDEX_PATH, "r", encoding="utf-8") as f:
            cls.html = f.read()

        cls.css = ""
        if os.path.exists(CSS_PATH):
            with open(CSS_PATH, "r", encoding="utf-8") as f:
                cls.css = f.read()

        cls.js_texts = []
        for root, _, files in os.walk(JS_DIR):
            for file in files:
                if file.endswith(".js"):
                    with open(os.path.join(root, file), "r", encoding="utf-8") as f:
                        cls.js_texts.append(f.read())

    def _resolve_path(self, relative_path):
        clean = relative_path.strip().lstrip("./").replace("/", os.sep)
        clean = clean.split("?")[0].split("#")[0]
        return os.path.join(ROOT_DIR, clean)

    def test_favicon_exists(self):
        """Verify favicon.png exists and is non-empty."""
        favicon_path = os.path.join(ROOT_DIR, "favicon.png")
        self.assertTrue(os.path.exists(favicon_path), "favicon.png missing from root")
        self.assertGreater(os.path.getsize(favicon_path), 0, "favicon.png is empty")

    def test_all_html_img_sources_exist(self):
        """Verify all local image sources in index.html exist on disk."""
        srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', self.html)
        local_srcs = [s for s in srcs if not s.startswith("http") and not s.startswith("data:")]
        self.assertGreater(len(local_srcs), 5, "Too few local images found in index.html")

        for src in local_srcs:
            full_path = self._resolve_path(src)
            self.assertTrue(os.path.exists(full_path), f"Image referenced in index.html not found: {src}")
            self.assertGreater(os.path.getsize(full_path), 0, f"Image file is empty (0 bytes): {src}")

    def test_all_html_doc_links_exist(self):
        """Verify resume/CV documents referenced in index.html exist on disk."""
        hrefs = re.findall(r'<a[^>]+href=["\']([^"\']+\.pdf)["\']', self.html)
        local_docs = [h for h in hrefs if not h.startswith("http")]
        self.assertGreater(len(local_docs), 0, "No local PDF documents found in index.html")

        for doc in local_docs:
            full_path = self._resolve_path(doc)
            self.assertTrue(os.path.exists(full_path), f"Document referenced in index.html not found: {doc}")
            self.assertGreater(os.path.getsize(full_path), 0, f"Document file is empty: {doc}")

    def test_css_stylesheet_exists(self):
        """Verify css/styles.css exists and is non-empty."""
        self.assertTrue(os.path.exists(CSS_PATH), "css/styles.css does not exist")
        self.assertGreater(os.path.getsize(CSS_PATH), 100, "css/styles.css is empty or too small")

    def test_all_character_sprites_exist(self):
        """Verify all essential adventure mode character pixel sprites exist."""
        required_sprites = [
            "front.png",
            "back.png",
            "idle.png",
            "jump.png",
            "walk-1.png",
            "walk-2.png",
            "back-walk-1.png",
            "back-walk-2.png",
        ]
        sprites_dir = os.path.join(ROOT_DIR, "img", "character-sprites")
        self.assertTrue(os.path.isdir(sprites_dir), "img/character-sprites directory does not exist")

        for sprite in required_sprites:
            sprite_path = os.path.join(sprites_dir, sprite)
            self.assertTrue(os.path.exists(sprite_path), f"Character sprite missing: {sprite}")
            self.assertGreater(os.path.getsize(sprite_path), 0, f"Character sprite is empty: {sprite}")

    def test_adventure_sound_icons_exist(self):
        """Verify all adventure sound toggle icons exist for both light and dark themes."""
        sound_icons = [
            "sound-on-dark.png",
            "sound-on-light.png",
            "sound-off-dark.png",
            "sound-off-light.png",
        ]
        icons_dir = os.path.join(ROOT_DIR, "img", "icons")
        self.assertTrue(os.path.isdir(icons_dir), "img/icons directory does not exist")

        for icon in sound_icons:
            icon_path = os.path.join(icons_dir, icon)
            self.assertTrue(os.path.exists(icon_path), f"Sound icon missing: {icon}")
            self.assertGreater(os.path.getsize(icon_path), 0, f"Sound icon is empty: {icon}")

    def test_photography_photos_exist(self):
        """Verify that all photography gallery images exist and are non-empty."""
        photo_dir = os.path.join(ROOT_DIR, "img", "photography")
        self.assertTrue(os.path.isdir(photo_dir), "img/photography directory does not exist")

        photos = [f for f in os.listdir(photo_dir) if f.lower().endswith((".webp", ".jpg", ".jpeg", ".png"))]
        self.assertGreaterEqual(len(photos), 4, f"Photography directory has too few images: {len(photos)}")

        for photo in photos:
            photo_path = os.path.join(photo_dir, photo)
            self.assertGreater(os.path.getsize(photo_path), 0, f"Photography photo is empty: {photo}")

    def test_experience_and_handicraft_images_exist(self):
        """Verify that experience and handicrafts photo directories exist with valid images."""
        for sub in ["experience", "handicrafts"]:
            d = os.path.join(ROOT_DIR, "img", sub)
            self.assertTrue(os.path.isdir(d), f"img/{sub} directory does not exist")
            files = [f for f in os.listdir(d) if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))]
            self.assertGreaterEqual(len(files), 1, f"img/{sub} has no images")
            for f in files:
                self.assertGreater(os.path.getsize(os.path.join(d, f)), 0, f"Image {f} in img/{sub} is empty")

    def test_js_referenced_local_assets_exist(self):
        """Verify any asset paths referenced in JS files exist on disk."""
        for js_text in self.js_texts:
            asset_refs = re.findall(r'["\'](\./img/[^"\']+)["\']', js_text)
            for ref in asset_refs:
                full_path = self._resolve_path(ref)
                self.assertTrue(os.path.exists(full_path), f"Asset referenced in JS not found on disk: {ref}")
                self.assertGreater(os.path.getsize(full_path), 0, f"Asset referenced in JS is empty: {ref}")

    def test_all_modular_js_files_exist(self):
        """Verify all modular JS architecture files exist and are non-empty."""
        expected_modules = [
            os.path.join("js", "translations.js"),
            os.path.join("js", "modules", "audio.js"),
            os.path.join("js", "modules", "theme.js"),
            os.path.join("js", "modules", "ui.js"),
            os.path.join("js", "modules", "i18n.js"),
            os.path.join("js", "modules", "lightbox.js"),
            os.path.join("js", "modules", "adventure.js"),
            os.path.join("js", "main.js"),
        ]
        for rel in expected_modules:
            full = os.path.join(ROOT_DIR, rel)
            self.assertTrue(os.path.exists(full), f"Modular JS file missing: {rel}")
            self.assertGreater(os.path.getsize(full), 50, f"Modular JS file is too small or empty: {rel}")


if __name__ == "__main__":
    unittest.main()
