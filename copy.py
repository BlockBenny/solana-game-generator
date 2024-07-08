import os


def is_excluded(path, exclude_dirs, exclude_files):
    path_parts = path.split(os.sep)
    return any(excluded in path_parts for excluded in exclude_dirs) or any(
        path.endswith(excluded) for excluded in exclude_files
    )


def copy_structure_and_content(
    source_dir, output_file, exclude_dirs=None, exclude_files=None
):
    if exclude_dirs is None:
        exclude_dirs = []
    if exclude_files is None:
        exclude_files = []

    with open(output_file, "w", encoding="utf-8") as f:
        for root, dirs, files in os.walk(source_dir, topdown=True):
            # Remove excluded directories
            dirs[:] = [
                d
                for d in dirs
                if not is_excluded(os.path.join(root, d), exclude_dirs, exclude_files)
            ]

            # Check if the current directory should be excluded
            if is_excluded(root, exclude_dirs, exclude_files):
                continue

            # Write directory path
            rel_dir = os.path.relpath(root, source_dir)
            level = rel_dir.count(os.sep)
            indent = " " * 4 * level
            f.write(f"{indent}{os.path.basename(root)}/\n")

            # Write file names and contents
            sub_indent = " " * 4 * (level + 1)
            for file_name in files:
                if is_excluded(file_name, exclude_dirs, exclude_files):
                    continue
                file_path = os.path.join(root, file_name)
                f.write(f"{sub_indent}{file_name}\n")
                f.write(f'{sub_indent}{"=" * len(file_name)}\n')
                try:
                    with open(file_path, "r", encoding="utf-8") as file:
                        content = file.read()
                        f.write(f"{sub_indent}{content}\n\n")
                except Exception as e:
                    f.write(f"{sub_indent}[Error reading file: {str(e)}]\n\n")


# Usage
source_directory = "."
output_file = "./project_structure_and_content.txt"
exclude_dirs = ["node_modules", ".next", ".git", "__pycache__", "public", "styles"]
exclude_files = [
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    ".env.local",
    "copy.py",
    "README.md",
    ".gitignore",
    "game0.html",
    "global.css",
    "dbInit.js",
    "jsconfig.json",
    "tsconfig.json",
    "tsconfig.server.json",
    "tailwind.config.js",
    ".DS_Store",
    "postcss.config.mjs",
    "next.config.mjs",
    "package.json",
    "WhitepaperPage.js",
    "LeaderboardPage.js",
    "SpaceInvadersPage.js",
    "SpaceInvadersGame.js",
]

copy_structure_and_content(source_directory, output_file, exclude_dirs, exclude_files)
