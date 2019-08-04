import React from 'react';
import { Progress, Col, Row, Card, Slider, Icon, Breadcrumb, Avatar, Button, Modal, message } from 'antd'
import IMG_1 from "./img/1.jpg"
import styles from "./style.module.scss"
import Orders from "../../../components/Orders/Orders"
import { Link, withRouter } from 'react-router-dom'
import axios from 'axios'
import erc20 from '../../../utilities/erc20/index'
const { Meta } = Card;

const ButtonGroup = Button.Group;
class Index extends React.Component {
  state = { project: {}, borrowVisible: false, supportVisible: false, sponseCoin: 1 };

  showBorrowModal = () => {
    this.setState({
      borrowVisible: true,
    });
  };

  showSupportModal = () => {
    this.setState({
      supportVisible: true,
    });
  }
  handleSupportCancel = () => {
    this.setState({
      supportVisible: false,
    });
  }



  handleBorrowCancel = e => {

    this.setState({
      borrowVisible: false,
    });
  }

  componentDidMount() {
    this.getProjectById();
    this.getUsersCoin();
  }

  getProjectById = () => {

    axios.get(window.SITE_CONFIG.BASE_URL + this.props.match.params.id).then(res => {
      console.log(res.data)
      this.setState({ project: res.data.product })
    }).catch(err => {
      message.error("Error while fetching project data")
    })

  }

  getUsersCoin = async () => {

    let balance = await erc20.balanceOf(window.web3.currentProvider.selectedAddress);

    if (!balance.includes("0x"))
      this.setState({ userCoin: balance })
    else
      this.getUsersCoin();
  }

  supportThisProject = async (coins) => {
    let txId = await erc20.sendERC20(window.web3.currentProvider.selectedAddress, coins * 8)
    console.log(txId)
    this.updateProjectById(coins)
  }

  updateProjectById = (coins) => {
    let project = this.state.project;
    let data = {
      goalPledge: project.goalPledge + coins / 10,
      backer: project.backer + 1
    }
    axios.patch(window.SITE_CONFIG.BASE_URL + this.props.match.params.id, data).then(res => {
      message.success("Thank you for supporting this project");
      this.handleSupportCancel();
      this.getProjectById();
      setTimeout(() => {
        this.getUsersCoin();
      }, 3000);

      console.log(res.data)
    }).catch(err => {
      console.log(err)
      message.error("Error while Sending transactions")
    })
  }
  render() {
    console.log(this.props)
    let project = this.state.project;
    console.log(project)
    let sponserType = "Bronze Sponser";
    if (this.state.sponseCoin > 8)
      sponserType = "Platinium Sponser"
    else if (this.state.sponseCoin > 5)
      sponserType = "Gold Sponser"
    else if (this.state.sponseCoin > 3)
      sponserType = "Silver Sponser"
    else
      sponserType = "Bronze Sponser"

    return (
      <React.Fragment>
        <Modal
          width="90%"
          bodyStyle={{ padding: "0px 0px 30px 0px" }}
          title="Borrow"
          footer={null}

          visible={this.state.borrowVisible}

          onCancel={this.handleBorrowCancel}
        >
          <Orders />
        </Modal>

        <Modal
          width="60%"
          title={`Sponser`}
          className={styles.supportModel}
          footer={null}

          bodyStyle={{ padding: "0px" }}
          visible={this.state.supportVisible}
          onCancel={this.handleSupportCancel}
        >
          <Row type="flex" >
            <Col className={styles.sponseCard1} xs={12}>
              <p className="text-center">You will get <span style={{ color: "#1890ff", fontWeight: "800" }}>{this.state.sponseCoin * 8} PREICONCoins </span>againse {this.state.sponseCoin / 10} DAI  </p>
              <h2 className={styles.sponserTypeText}>{sponserType}</h2>
            </Col>
            <Col style={{ padding: "20px 16px" }} xs={12}>
              <h4 className={styles.title}>{project.title}</h4>
              <p className={styles.desc}>{project.description}</p>

              <div className={styles.sliderWrapper}>
                <span>Select Coins You want to contribute{(this.state.sponseCoin && this.state.sponseCoin != 0) ? " : " + (this.state.sponseCoin / 10) + " DAI" : ""}</span>
                <Slider tooltipVisible={false} value={this.state.sponseCoin} onChange={(value) => {
                  this.setState({ sponseCoin: value })
                }} defaultValue={1} max={10} min={1} />
              </div>
              <div className={styles.buttonsWrapper}>
                <ButtonGroup className={styles.buttonGroup}>
                  <Button onClick={this.handleSupportCancel}>Cancel</Button>
                  <Button onClick={() => this.supportThisProject(this.state.sponseCoin)} type="primary">Send</Button>
                </ButtonGroup>
              </div>
            </Col>
          </Row>

        </Modal>
        <div className="container">
          <Card

            className={styles.card}
            bodyStyle={{ padding: "0px" }}
          >
            <Row type="flex">

              <Col style={{ display: "flex", alignItems: "center", background: "#1E1C2E" }} md={12}>



                <img className="img-fluid" style={{ width: "100%", maxHeight: 530, objectFit: "cover" }} src={window.SITE_CONFIG.IMG_URL + project.image}></img>

              </Col>

              <Col md={12}>

                <div className={styles.dataWrapper}>
                  <Breadcrumb>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <a href="">Game</a>
                    </Breadcrumb.Item>
                  </Breadcrumb>
                  <h4 className={styles.title}>{project.title}</h4>
                  <Meta description={project.description} />
                  <div className={styles.backerWrapper}>
                    <Icon type="user" />
                    <p className="text-right text-black">{project.backers} Backers</p>
                  </div>
                  <div className={styles.dateWrapper}>
                    <p className="text-right text-black">{project.listedDate} TO {project.endDate}</p>
                  </div>
                  {this.state.userCoin && (
                    <div className={styles.alphaHighlight}>
                      <p>You have {this.state.userCoin} PREICOCoin of this project</p>
                    </div>
                  )}
                  <div className={styles.highlight}>
                    <div className={styles.progressWrapper}>
                      <h3>{Math.round(project.goalPledge)}<small className={styles.pledgeSmall}>pledge out of {project.goal}</small></h3>
                      <Progress percent={(project.goalPledge * 100 / project.goal).toFixed(1)} />
                    </div>
                    <div className={styles.actionWrapper}>
                      <ButtonGroup >
                        <Button onClick={this.showBorrowModal} type="primary">Borrow</Button>
                        <Button onClick={this.showSupportModal} type="primary">Support</Button>
                      </ButtonGroup>


                    </div>
                  </div>
                  <div className={styles.ownerInfo}>
                    <Avatar icon="user" />
                    <div>
                      <span>{project.ownerName}</span>
                      <small><a href={project.website} target="_blank">{project.website}</a></small>
                    </div>
                  </div>

                </div>

              </Col>


            </Row>
          </Card>
        </div>
      </React.Fragment >
    )
  }
}

export default withRouter(Index);