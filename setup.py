import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name = 'poly-crypto',
    version = '1.0.0',
    description = "High-level cryptographic functions that are interoperable between NodeJS, PHP 7.1+, and Python.",
    author = 'kensnyder',
    author_email = 'kendsnyder@gmail.com',
    long_description = long_description,
    long_description_content_type = "text/markdown",
    url = 'https://github.com/kensnyder/poly-crypto',
    packages = setuptools.find_packages(),
)
