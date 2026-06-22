import http from "k6/http";

export const options = {
  vus: 50,
  duration: "1m",
};

export default function () {
  http.get("http://65.1.106.101:3000/health");
}