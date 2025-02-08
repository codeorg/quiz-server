import test from 'ava';
import { request } from 'graphql-request';

const API_URL = 'http://localhost:4000';

test('mutation Reg', async (t) => {
    const query = `mutation Reg($role: String!, $password: String!, $mobile: String!, $username: String!) {
      reg(role: $role, password: $password, mobile: $mobile, username: $username)
    }`
    const variables = {
        username: 'aaa',
        password: 'aaa',
        mobile: '17777777771',
        role: 'user',
    }

    const data: any = await request(API_URL, query, variables);
    console.log('*-----', data)
    t.truthy(data.reg); // Check data exists
    t.is(data.reg, true); // Assert specific values
});



test('预订', async (t) => {
    //先登录
    const query = `query Query($password: String!, $username: String!) {
        login(password: $password, username: $username)
      }`
    const variables = {
        username: 'test',
        password: 'test',
    }

    const res_user: any = await request(API_URL, query, variables);
    // console.log('user', user)
    t.truthy(res_user.login);
    //t.is(user.login.token, '');
    let user = JSON.parse(res_user.login)
    console.log('token', user.token)
    if (!user.token) return t.fail('用户登录失败')

    const queryInsertOrder = `mutation InsertOrder($mobile: String!, $name: String!, $eta: Float!) {
        insertOrder(mobile: $mobile, name: $name, eta: $eta)
      }`
    const variablesInsertOrder = { eta: new Date('2025-10-01 00:00:00').getTime(), name: '李一一', mobile: '17111111111' }
    const order: any = await request(API_URL, queryInsertOrder, variablesInsertOrder, { 'authorization': user.token });
    console.log('order', order.insertOrder)
    t.truthy(order.insertOrder);
    t.is(order.insertOrder, true);
});
