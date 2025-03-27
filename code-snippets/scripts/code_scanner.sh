#!/bin/bash

# Steps:
# 1. List out "swift, kt, java, js, ts" inside this folder.
# 2. grep -v to filter out some files.
# 3. Grab the pattern of "begin_sample_code...end_sample_code"
# 4. Separate each chunk by '\n----sample_code_separator----'. For the next step processing.

find ../src/ \
-path ./node_modules -prune \
-o -path ./_temporary -prune \
-o -name "*.swift" \
-o -name "*.java" \
-o -name "*.kt" \
-o -name "*.js" \
-o -name "*.ts" \
-o -name "*.jsx" \
-o -name "*.tsx" \
-type f \
| grep -v "create-gist.js" \
| grep -v "update-sample-code.js" \
| grep -v "sample-code-project-validator.js" \
| grep -v "node_modules" \
| grep -v "_temporary" \
| tr \\n \\0  \
| xargs -0 pcregrep -M '(?s)begin_sample_code.*?.*?end_sample_code' \
| sed "s/end_sample_code \*\//end_sample_code \*\/\\n----sample_code_separator----/g"
