import axios from "axios";

const api = axios.create({
  baseURL: "http://3.110.31.131:2358",
  headers:{
    "Content-Type": "application/json"
  }
});

export const executeCode = async (
  {id}: {id: Number;},
  sourceCode: string,
  input: string
) => {
  const response = await api.post("/submissions?base64_encoded=false&wait=true", {
    source_code:sourceCode,
    language_id:id,
    stdin: input,
  });

  return response.data;
};
