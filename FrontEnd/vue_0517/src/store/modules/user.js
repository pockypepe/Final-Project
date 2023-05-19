import jwtDecode from 'jwt-decode';
import router from '@/router';
import { login, findById, tokenRegeneration, logout, signup } from '@/api/user.js';

const user = {
  namespaced: true,
  state: {
    isLogin: false,
    isLoginError: false,
    isValidToken: false,
    isSignUp: false,
    user: null,
    isUpdate: 0,
  },
  getters: {
    checkUserInfo: function (state) {
      return state.user;
    },
    checkToken: function (state) {
      return state.isValidToken;
    },
  },
  mutations: {
    SET_IS_LOGIN: (state, isLogin) => {
      state.isLogin = isLogin;
    },
    SET_IS_LOGIN_ERROR: (state, isLoginError) => {
      state.isLoginError = isLoginError;
    },
    SET_IS_VALID_TOKEN: (state, isValidToken) => {
      state.isValidToken = isValidToken;
    },
    SET_USER_INFO: (state, user) => {
      state.isLogin = true;
      state.user = user;
    },
    SET_IS_SIGNUP: (state, isSignUp) => {
      state.isSignUp = isSignUp;
    },
    SET_LOGOUT: (state) => {
      state.isLogin = false;
      state.isLoginError =  false;
      state.user = null;
      state.isValidToken = false;
      state.isSignUp = false;
      sessionStorage.removeItem("access-token")
      sessionStorage.removeItem("refresh-token")
    },
    // 마이페이지 관련
    SET_IS_UPDATE(state, isUpdate) {
        state.isUpdate = isUpdate;
      },
  },
  actions: {
    async userConfirm({ commit }, user) {
      await login(
        user,
        ({ data }) => {
          if (data.message === 'success') {
            let accessToken = data['access-token'];
            let refreshToken = data['refresh-token'];
            commit('SET_IS_LOGIN', true);
            commit('SET_IS_LOGIN_ERROR', false);
            commit('SET_IS_VALID_TOKEN', true);
            sessionStorage.setItem('access-token', accessToken);
            sessionStorage.setItem('refresh-token', refreshToken);
          } else {
            commit('SET_IS_LOGIN', false);
            commit('SET_IS_LOGIN_ERROR', true);
            commit('SET_IS_VALID_TOKEN', false);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async getUserInfo({ commit, dispatch }, token) {
      let decodeToken = jwtDecode(token);
      await findById(
        decodeToken.userid,
        ({ data }) => {
          if (data.message === 'success') {
            commit('SET_USER_INFO', data.user);
            // console.log("3. getUserInfo data >> ", data);
          } else {
            console.log('유저 정보 없음!!!!');
          }
        },
        async (error) => {
          console.log(
            'getUserInfo() error code [토큰 만료되어 사용 불가능.] ::: ',
            error.response.status
          );
          commit('SET_IS_VALID_TOKEN', false);
          await dispatch('tokenRegeneration');
        }
      );
    },
    async tokenRegeneration({ commit, state }) {
      console.log('토큰 재발급 >> 기존 토큰 정보 : {}', sessionStorage.getItem('access-token'));
      await tokenRegeneration(
        JSON.stringify(state.user),
        ({ data }) => {
          if (data.message === 'success') {
            let accessToken = data['access-token'];
            console.log('재발급 완료 >> 새로운 토큰 : {}', accessToken);
            sessionStorage.setItem('access-token', accessToken);
            commit('SET_IS_VALID_TOKEN', true);
          }
        },
        async (error) => {
          // HttpStatus.UNAUTHORIZE(401) : RefreshToken 기간 만료 >> 다시 로그인!!!!
          if (error.response.status === 401) {
            console.log('갱신 실패');
            // 다시 로그인 전 DB에 저장된 RefreshToken 제거.
            await logout(
              state.user.userId,
              ({ data }) => {
                if (data.message === 'success') {
                  console.log('리프레시 토큰 제거 성공');
                } else {
                  console.log('리프레시 토큰 제거 실패');
                }
                alert('RefreshToken 기간 만료!!! 다시 로그인해 주세요.');
                commit('SET_IS_LOGIN', false);
                commit('SET_USER_INFO', null);
                commit('SET_IS_VALID_TOKEN', false);
                router.push({ name: 'login' });
              },
              (error) => {
                console.log(error);
                commit('SET_IS_LOGIN', false);
                commit('SET_USER_INFO', null);
              }
            );
          }
        }
      );
    },
    async userLogout({ commit }, userid) {
      await logout(
        userid,
        ({ data }) => {
          if (data.message === 'success') {
            commit('SET_IS_LOGIN', false);
            commit('SET_USER_INFO', null);
            commit('SET_IS_VALID_TOKEN', false);
          } else {
            console.log('유저 정보 없음!!!!');
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async userSignup({commit}, user) {
      await signup (
        user,
        ({data}) => {
          if (data.message === 'success') {
            commit('SET_IS_SIGNUP', true);
          }
        },
        (error) => {
          console.log(error);
          alert("회원가입에 실패");
          throw new Error("실패띠")
        })
    }
  },
};

export default user;