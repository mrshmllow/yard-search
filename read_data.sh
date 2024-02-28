#!/bin/sh -x

if [ ! -d "$1" ]; then
  echo "$1 does not exist."
  exit
fi

mkdir -p $1

pushd $1

for filename in *.wav.vtt; do
	number=${filename%% *}
	chapter=${filename%.*.*}
	chapter=${chapter#* }
	echo "$a"
	data=$(jq -Rs "{ trans: ., id: \"$1-$number\", \"chapter\": \"$chapter\", \"youtube_id\": \"$1\", \"uploaded\": \"2024-02-23\" }" "$filename")

	echo "$data" > data.json

	curl \
          -X POST 'http://localhost:7700/indexes/chapters/documents?primaryKey=id' \
          -H 'Content-Type: application/json' \
          -H 'Authorization: Bearer HWoz-31otPLUyXZmEfFDWpC3osm3XTW0Ebv3GTj5yrg' \
          --data-binary @data.json
done

popd
