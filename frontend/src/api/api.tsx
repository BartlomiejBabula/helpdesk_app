import axios from "axios";

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = "https://esambohd-bck.skg.pl";
export const AppURL = "https://esambohd-bck.skg.pl";
// axiosInstance.defaults.baseURL = process.env.BACKEND;
// export const AppURL = process.env.BACKEND;

export const setAuthHeader = (token: any) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
setAuthHeader(localStorage.getItem("access"));

const saveToken = (response: any) => {
  localStorage.setItem("refresh", response.data.refreshToken);
  localStorage.setItem("access", response.data.token);
};

const destroyToken = () => {
  localStorage.removeItem("refresh");
  localStorage.removeItem("access");
};

function createAxiosResponseInterceptor() {
  const interceptor = axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Reject promise if usual error

      if (error.response.status !== 401) {
        return Promise.reject(error);
      }

      /*
       * When response code is 401, try to refresh the token.
       * Eject the interceptor so it doesn't loop in case
       * token refresh causes the 401 response
       */
      axiosInstance.interceptors.response.eject(interceptor);
      const refreshToken = localStorage.getItem("refresh");
      return axiosInstance
        .post("/refresh-token", {
          refreshToken: refreshToken,
        })
        .then((response) => {
          saveToken(response);
          setAuthHeader(response.data.token);
          error.response.config.headers["Authorization"] =
            "Bearer " + response.data.token;
          return axiosInstance(error.response.config);
        })
        .catch((error) => {
          destroyToken();
          return Promise.reject(error);
        })
        .finally(createAxiosResponseInterceptor);
    }
  );
}
createAxiosResponseInterceptor();

export default axiosInstance;
