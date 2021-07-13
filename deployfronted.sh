rsync -r src/ docs/
rsync -r build/contracts/ docs/
git add .
git commit -m "sync docs for GitHub pages"
git push
