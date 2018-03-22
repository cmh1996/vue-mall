import * as types from './mutation-types';
import {setLocalItem} from '../util/util';

const mutations = {
	//管理员
  	[types.SET_ADMIN_TOKEN]:(state, adminToken) => {
  		state.adminToken = adminToken;
  		setLocalItem('adminToken',adminToken);
  	},
	[types.ADMIN_LOGOUT]: (state) => {
	    state.adminToken = null;
	    state.adminName = '';
	    localStorage.removeItem('adminToken','adminName');
	},
	[types.SET_ADMIN_NAME]:(state, name) => {
  		state.adminName = name;
  		setLocalItem('adminName',name);
  	},
	
	//客户
	[types.SET_CLIENT_TOKEN]:(state, clientToken) => {
  		state.clientToken = clientToken;
  		setLocalItem('clientToken',clientToken);
  	},
  	[types.SET_CLIENT_NAME]:(state, name) => {
  		state.clientName = name;
  		setLocalItem('clientName',name);
  	},
	[types.CLIENT_LOGOUT]: (state) => {
	    state.clientToken = null;
	    state.clientName = '';
	    localStorage.removeItem('clientToken','clientName');
	},
}

export default mutations;