import http from "../http";

export function getResult(result) {
  return (dispatch, getState) => {
    const { apiURL } = getState().config;
    return http.get(`${apiURL}/api/v1/results/${result.id}`);
  };
}

