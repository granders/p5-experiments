set -e
set -u

if [ -z "$(which realpath)" ]; then
    echo "This script requires realpath to run correctly. Try installing gnu coreutils with 'brew install coreutils'"
fi

PROG_NAME="$(realpath "$0")"
BASE_DIR="$(dirname "$PROG_NAME")"
EXPERIMENTS_DIR="$BASE_DIR/experiments"
BASE_INDEX_HTML="$BASE_DIR/index.html"

rm "$BASE_INDEX_HTML"

for directory in $(ls "$EXPERIMENTS_DIR"); do
    echo "Adding link to $directory..."
    echo "<a href=\"experiments/$directory\">$directory</a><br />" >> "$BASE_INDEX_HTML"
done

cat "$BASE_INDEX_HTML"
