TOOLS="income-mountain
bubble-chart
bubble-map"

for TOOL in $TOOLS
do
  FILES=./test/tools/$TOOL/human-acceptance/*[0-9]
  for f in $FILES
  do
    grunt build --tool=$TOOL --hatnum=`basename $f`
  done
done
