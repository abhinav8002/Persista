export function objectToString(data) {
  var res = ""
  for(var i = 0; i < data.AI.length; i++) {
    res += `{"input": "${data.AI[i]}"}, {"output": "${data.User[i]}"}, `
  }
  return res;
}
