#!/bin/sh -x
set -e

if [ ! -d "$1" ]; then
  echo "$1 does not exist."
  exit
fi

if [ ! "$2" ]; then
  echo "please pass an episode number"
  exit
fi

mkdir -p $1

pushd $1

info_file="source.info.json"

for filename in *.wav.vtt; do
	number=${filename%% *}
	chapter=${filename%.*.*}
	chapter=${chapter#* }

	offset=$(cat "$info_file" | jq ".chapters[] | select(.title==\"$chapter\").start_time | floor")
	uploaded=$(cat "$info_file" | jq ".upload_date | tonumber")

	data=$(jq -Rs "{ trans: ., id: \"$1-$number\", \"chapter\": \"$chapter\", \"episode\": $2, \"offset\": $offset, \"youtube_id\": \"$1\", \"uploaded\": $uploaded }" "$filename")

	echo "$data" > data.json

	curl \
          -X POST 'http://localhost:7700/indexes/chapters/documents?primaryKey=id' \
          -H 'Content-Type: application/json' \
          -H 'Authorization: Bearer HWoz-31otPLUyXZmEfFDWpC3osm3XTW0Ebv3GTj5yrg' \
          --data-binary @data.json
done

popd

echo "Done!"
