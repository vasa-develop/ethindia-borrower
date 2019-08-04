import React from 'react';
import { Col, Row, Card, message } from 'antd'

import styles from "./style.module.scss"
import { Progress } from 'antd';
import axios from 'axios'
import { Link } from 'react-router-dom'
const { Meta } = Card;

class Index extends React.Component {
  state = {
    projects: []
  }
  componentDidMount() {
    this.getProjects();
  }

  getProjects = () => {
    axios.get(window.SITE_CONFIG.BASE_URL).then(res => {
      this.setState({ projects: res.data.products })
      console.log(res.data)
    }).catch(err => {
      message.error("Error while fetching projects")
      console.log(err)
    })
  }


  render() {
    let project = this.state.projects;

    return (
      <div className="container">
        <Row type="flex" gutter={8}>
          {
            project.map((p, i) => (



              <Col className={"mt-4"} key={i} sm={24} md={12} lg={8}>
                <Link to={"/project/" + p._id}>
                  <Card
                    hoverable
                    className={styles.card}
                    cover={<img className="img-fluid" style={{ height: "360px", objectFit: "cover" }} src={window.SITE_CONFIG.IMG_URL + p.image}></img>}
                  >


                    <Meta title={<h4 className={styles.title}>{p.title}</h4>} description={p.description} />
                    <div className={styles.progressWrapper}>

                      <h3>{Math.round(p.goalPledge)}<small className={styles.pledgeSmall}>pledge out of {p.goal}</small></h3>
                      <Progress percent={(p.goalPledge * 100 / p.goal).toFixed(1)} status="active" />
                    </div>
                    <div className={styles.ownerInfo}>
                      <span>{p.ownerName}</span>
                      <br />
                      <a href={p.website} target="_blank">
                        <span>{p.website}</span>
                      </a>
                    </div>

                  </Card>
                </Link>
              </Col>
            ))}  </Row>
      </div>
    )
  }
}

export default Index;