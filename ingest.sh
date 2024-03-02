#!/bin/sh -x

if [ -d "$1" ]; then
  echo "$1 exist."
  exit
fi

if [ ! -f "$2" ]; then
  echo "$2 is not a file"
  exit
fi

mkdir -p $1

abs_model=$(readlink -f "$2")

pushd $1

yt-dlp "https://www.youtube.com/watch?v=$1" \
	-x \
	--split-chapters \
	--sponsorblock-remove "all" \
	-o "chapter:%(section_number)s %(section_title)s.%(ext)s" \
	-o "source" \
	--audio-format wav \
	--write-info-json \
	--postprocessor-args "-ar 16000 -ac 1 -c:a pcm_s16le"

rm source

for filename in *.wav; do
	whisper-cpp -m "$abs_model" -f "$filename" --output-vtt
done

popd
