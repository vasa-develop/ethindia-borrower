import React from 'react'
import { Modal, Button, message } from 'antd'
import styles from './style.module.scss'
import ButtonGroup from 'antd/lib/button/button-group';
import erc20 from "../../../utilities/erc20/index"
class Index extends React.Component {
    state = { visible: false, username: "" };
    componentDidMount() {
        if (this.props.handleShowLogin) {
            this.props.handleShowLogin(this.showModal)
            console.log("callerd")
        }
        this.getUserNameByContract();
    }
    showModal = () => {
        this.setState({
            visible: true,
        }, () => {
            this.getUserNameByContract()
        });

    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    getUserNameByContract = () => {
        let username = window.localStorage.getItem("addr:" + window.web3.currentProvider.selectedAddress)
        if (username) {
            message.success("Welcome " + username)
            setTimeout(() => {
                this.setState({ visible: false })
            }, 500);
        }
    }
    onUserNameChanged = async (e) => {
        this.setState({ username: e.target.value })
        if (e.target.value.trim().length === 0) {
            this.setState({ usernameExist: true })
            return;
        }
        let onUserNameChanged = window.localStorage.getItem(e.target.value);
        if (onUserNameChanged) {
            this.setState({ usernameExist: true })
        } else {
            this.setState({ usernameExist: false })
        }
    }
    registerUser = async (e) => {
        if (this.state.username.trim().length === 0) {
            this.setState({ usernameExist: true })
            return;
        }
        if (!this.state.usernameExist) {
            window.localStorage.setItem(this.state.username, window.web3.currentProvider.selectedAddress);
            window.localStorage.setItem("addr:" + window.web3.currentProvider.selectedAddress, this.state.username);
            this.setState({ visible: false });
            message.success("Loggined Successfully");
        } else {
            message.error("Username is already in use")
        }
    }
    render() {
        return (
            <Modal
                footer={null}

                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <h2 className={styles.title}>Welcome</h2>
                <h4 className={styles.smallTitle}>Login with Metamask</h4>
                <h5 className={styles.subTitle}>Please add username for your metamask Id:<br /><span>{window.web3.currentProvider.selectedAddress}</span></h5>
                <input onChange={this.onUserNameChanged} type="text" placeholder="Username" className={styles.userNameField + " " + (this.state.usernameExist ? styles.red : styles.green)} />
                <ButtonGroup className={styles.buttonGroup}>
                    <Button>Cancel</Button>
                    <Button onClick={this.registerUser} type="primary">Login</Button>
                </ButtonGroup>
            </Modal>
        )
    }
}

export default Index;