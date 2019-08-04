import React from 'react'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

import styles from "./style.module.scss"
import Projects from './projects/index'
import Project from './project/index'
import { Route, Link } from 'react-router-dom'
import Login from './login/index'
import AddProject from './addProject/index'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class Index extends React.Component {
  state = {}
  getNavButtonText = () => {
    let user = window.localStorage.getItem("addr:" + window.web3.currentProvider.selectedAddress);
    return user || "Login";
  }
  render() {

    return (
      <React.Fragment>
        <Login handleShowLogin={(showLogin) => {
          if (this.state.showLogin == undefined)
            this.setState({ showLogin })
        }} />

        <Layout>

          <Header className={"header " + styles.header_bar}>
            <Link to="/">
              <div className={styles.logo} >
                VIRTUAL Hedgers
              </div>
            </Link>
            <Menu
              theme="dark"

              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item onClick={this.state.showLogin} disabled={this.getNavButtonText() != "Login"} key="1">{
                this.getNavButtonText()
              }</Menu.Item>
            </Menu>
          </Header>
          <Layout>

            <Layout style={{ padding: '0 24px 24px' }}>

              <Content
                style={{
                  marginTop: "16px",
                  minHeight: 280,
                }}
              >

                <Route exact path="/" render={() => <Projects />} />
                <Route exact path="/project/:id" render={() => <Project />} />
                <Route exact path="/addProject" render={() => <AddProject />} />
              </Content>
            </Layout>
          </Layout>
        </Layout >
      </React.Fragment>
    )


  }
}

export default Index