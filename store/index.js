import axios from 'axios'
import Cookie from 'js-cookie'
import _ from "lodash";

export const state = () => ({
  authorization: false,
  authUser: null,
  productsList: null
})

export const mutations = {
  SET_AUTH (state, isToken){
    state.authorization = isToken
  },
  SET_USER (state, user) {
    state.authUser = user
  },
  SET_PRODUCTS_LIST (state, products) {
    state.productsList = _.map(products, (product)=>{
     return {
      id: product.id,
      img: `http://smktesting.herokuapp.com/static/${product.img}`,
      text: product.text,
      title: product.title
     } 
    })
  },

}

export const actions = {
  getAuth({commit}){
    commit('SET_AUTH', Cookie.get('token') || null)
  },
  getUser({commit}){
    commit('SET_USER', Cookie.get('user') || null)
  },
  async getProducts({commit}){
    await axios.get('http://smktesting.herokuapp.com/api/products/')
    .then((res)=>{
      commit('SET_PRODUCTS_LIST', res.data)
    })
    .catch((err)=>{
    })
  },
  async register({commit}, {username, password}){
    await axios.post('http://smktesting.herokuapp.com/api/register/', {
        username,
        password
      }
    )
    .then((res)=>{
      Cookie.set('token', res.data.token)
      Cookie.set('user', username)
      commit('SET_USER', username)
      commit('SET_AUTH', true)
    })
    .catch((err)=>{
    })
  },
  
  async login ({ commit }, { username, password }) {
    try {
      await axios.post('http://smktesting.herokuapp.com/api/login/', {
         username,
         password 
        })
      .then((res)=>{
        Cookie.set('token', res.data.token)
        Cookie.set('user', username)
        commit('SET_USER', username)
        commit('SET_AUTH', true)
      })
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  logout ({ commit }) {
    Cookie.remove('token');
    Cookie.remove('user');
    commit('SET_AUTH', null)
    commit('SET_USER', null)
  }

}
