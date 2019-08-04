import React from 'react';
import {
  Form,
  Input,
  Tooltip,
  Upload,
  Cascader,
  Select,
  Row,
  Col,
  message,
  Checkbox,

  AutoComplete, Card, Icon, Button, InputNumber, DatePicker
} from 'antd'
import IMG_1 from "./img/1.jpg"
import styles from "./style.module.scss"
import Orders from "../../../components/Orders/Orders"
import axios from 'axios';
const { Meta } = Card;
const ButtonGroup = Button.Group;
const AutoCompleteOption = AutoComplete.Option;
class Index extends React.Component {
  state = { projectImage: [], autoCompleteResult: [], formValues: {} };
  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
    this.updateFieldValue('website', value)
  };


  handleSubmit = e => {
    e.preventDefault();
    console.log(e.target[1].value)
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log(this.state.formValues)
        this.axiosInsertForm(this.state.formValues)
      }
    });
  };


  axiosInsertForm = (formValues) => {
    let formData = new FormData();
    Object.keys(formValues).map(key => {
      console.log(key, formValues[key])
      formData.append(key, formValues[key])

    })
    formData.append("ownerName", "Parmesh")
    console.log(formData);
    console.log(window.SITE_CONFIG.BASE_URL)
    axios.post(window.SITE_CONFIG.BASE_URL, formData).then(res => {
      message.success('Project added successfully');
      console.log(res.data)
      this.setState({ formValues: {}, projectImage: [] })
    }).catch(err => {
      message.error("error while adding project. Please try again");
      console.log(err)
    })
  }

  updateFieldValue = (key, value) => {
    this.setState({ formValues: { ...this.state.formValues, [key]: value } })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    let formValues = this.state.formValues;
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const uploadProps = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      beforeUpload: (file) => {

        this.setState({ projectImage: [file] })
        this.updateFieldValue("image", file)
        return false;
      },
      fileList: this.state.projectImage,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    const websiteOptions = this.state.autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));
    return (
      <React.Fragment>

        <div className="container">

          <Row type="flex">



            <Col md={24}>
              <Card

                className={styles.card}

              >
                <div className={styles.dataWrapper}>
                  <Row>
                    <Col sm={8} />
                    <Col sm={16} >
                      <h4 className={styles.title}>Add Project</h4>
                    </Col>
                  </Row>

                  <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="Title">
                      {getFieldDecorator('title', {
                        initialValue: formValues.title,
                        rules: [
                          {
                            required: true,
                            message: 'Please input Title',
                          },
                        ],
                      })(<Input value={formValues.title} onChange={(e) => this.updateFieldValue('title', e.target.value)} />)}
                    </Form.Item>
                    <Form.Item label="Image" hasFeedback>
                      {getFieldDecorator('image', {
                        rules: [
                          {
                            required: true,
                            message: 'Please select image',
                          }
                        ],
                      })(<Upload {...uploadProps}>
                        <Button>
                          <Icon type="upload" /> Click to Upload
    </Button>
                      </Upload>)}
                    </Form.Item>
                    <Form.Item label="Description" hasFeedback>
                      {getFieldDecorator('description', {
                        initialValue: formValues.description,
                        rules: [
                          {
                            required: true,
                            message: 'Please add Description',
                          }
                        ],
                      })(<Input.TextArea value={formValues.description} onChange={(e) => this.updateFieldValue('description', e.target.value)} />)}
                    </Form.Item>

                    <Form.Item label="End Date" hasFeedback>
                      {getFieldDecorator('endDate', {
                        initialValue: formValues.endDate,
                        rules: [
                          {
                            required: true,
                            message: 'Enter End Date',
                          }
                        ],
                      })(<DatePicker value={formValues.endDate} onChange={(date, dateString) => this.updateFieldValue("endDate", dateString
                      )} />)}
                    </Form.Item>


                    <Form.Item label="Goal" hasFeedback>
                      {getFieldDecorator('goal', {
                        initialValue: formValues.goal,
                        rules: [
                          {
                            required: true,
                            message: 'Enter Goal Limit.',
                          }
                        ],
                      })(<InputNumber min={100} value={formValues.goal} onChange={(value) => this.updateFieldValue('goal', value)} max={50000} />)}
                    </Form.Item>

                    <Form.Item label="Project Website">
                      {getFieldDecorator('projectWebsite', {
                        initialValue: formValues.website,
                        rules: [{ required: true, message: 'Please input website!' }],
                      })(
                        <AutoComplete
                          dataSource={websiteOptions}
                          onChange={this.handleWebsiteChange}
                          placeholder="website"
                        >
                          <Input value={formValues.website} />
                        </AutoComplete>,
                      )}
                    </Form.Item>


                    <Form.Item {...tailFormItemLayout}>
                      {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                      })(
                        <Checkbox>
                          I have read the <a href="">agreement</a>
                        </Checkbox>,
                      )}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                      <Button type="primary" htmlType="submit">
                        Register
          </Button>
                    </Form.Item>
                  </Form>
                </div>
              </Card>
            </Col>


          </Row>

        </div>
      </React.Fragment >
    )
  }
}
const WrappedRegistrationForm = Form.create({ name: 'register' })(Index);
export default WrappedRegistrationForm;