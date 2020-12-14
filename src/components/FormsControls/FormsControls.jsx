import React from "react";
import styles from "./FormsControls.module.scss";
import { Field, reduxForm } from "redux-form";
import PropTypes from "prop-types";
import { Button, Form, Message, Card, Image, Grid } from "semantic-ui-react";

export class ImageLoadForm extends React.Component {
  static propTypes = {
    mimeType: PropTypes.string,
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    // redux-form props
    handleSubmit: PropTypes.func.isRequired,
  };
  static defaultProps = {
    mimeType: "image/jpeg, image/png",
    maxWidth: 4000,
    maxHeight: 4000,
    minWidth: 200,
    minHeight: 200,
    // handleSubmit: true
  };

  validateImageWidth = (imageFile) => {
    if (imageFile) {
      const { maxWidth, minWidth } = this.props;
      if (imageFile.width > maxWidth || imageFile.width < minWidth) {
        return `Image width must be less or equal to ${maxWidth}px and more or equal to ${minWidth}px`;
      }
    }
  };
  validateImageHeight = (imageFile) => {
    if (imageFile) {
      const { maxHeight, minHeight } = this.props;

      if (imageFile.height > maxHeight || imageFile.height < minHeight) {
        return `Image width must be less or equal to ${maxHeight}px and more or equal to ${minHeight}px`;
      }
    }
  };
  validateImageFormat = (imageFile) => {
    if (imageFile) {
      const { mimeType } = this.props;

      if (!mimeType.includes(imageFile.type)) {
        return `Image mime type must be ${mimeType}`;
      }
    }
  };
  handlePreview = (imageUrl) => {
    const previewImageDom = document.querySelector(".preview-image");
    previewImageDom.src = imageUrl;
  };
  handleChange = (event, input) => {
    event.preventDefault();
    let imageFile = event.target.files[0];
    if (imageFile) {
      const localImageUrl = URL.createObjectURL(imageFile);
      const imageObject = new window.Image();

      imageObject.onload = () => {
        imageFile.width = imageObject.naturalWidth;
        imageFile.height = imageObject.naturalHeight;
        input.onChange(imageFile);
        URL.revokeObjectURL(imageFile);
      };
      imageObject.src = localImageUrl;
      this.handlePreview(localImageUrl);
    }
  };
  renderFileInput = ({ input, type, meta }) => {
    const { mimeType } = this.props;
    return (
      <div>
        <input
          name={input.name}
          type={type}
          accept={mimeType}
          onChange={(event) => this.handleChange(event, input)}
        />
        {meta && meta.invalid && meta.error && (
          <Message negative header="Error:" content={meta.error} />
        )}
      </div>
    );
  };
  // handleSubmitForm = (values) => {
  //   console.log("Form Values: ", values);
  // };

  render() {
    const {
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      handleSubmit,

      //  input,
      //  meta,
      //  child,
      //  ...restProps
    } = this.props;

    // const { input, meta, child, ...restProps } = this.props;
    // console.log(restProps.onCTRLEnt);
    return (
      <Grid
        centered
        style={{ height: "100%" }}
        verticalAlign="middle"
        padded
        className={styles.wholeForm}
      >
        <Grid.Column style={{ maxWidth: 400 }}>
          <Card fluid>
            <Image
              src={""}
              alt="Фото продукта"
              className="preview-image"
              style={{ height: "300px", width: "300px", objectFit: "cover" }}
            />
            <Card.Content>
              <Card.Header className={styles.header}>
                Выберите фото продукта
              </Card.Header>
              {/* <Card.Meta>Form Meta</Card.Meta> */}
              <Card.Description>
                Картинка должна быть:
                <ul>
                  <li>формата JPEG или PNG</li>
                  <li>
                    {minWidth}px ≤ шириной ≤ {maxWidth}px
                  </li>
                  <li>
                    {minHeight}px ≤ высотой ≤ {maxHeight}px
                  </li>
                </ul>
              </Card.Description>
            </Card.Content>
            <Card.Content>
              <Form onSubmit={handleSubmit}>
                <Form.Field>
                  <Field
                    name="image"
                    type="file"
                    validate={[
                      this.validateImageWidth,
                      this.validateImageHeight,
                      this.validateImageFormat,
                    ]}
                    component={this.renderFileInput}
                  />
                </Form.Field>
                <Button
                  primary
                  type="submit"
                  className="form-submit-button"
                  // onClick={handleSubmit(this.handleSubmitForm)}
                >
                  Загрузить
                </Button>
              </Form>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }
}

export const ImageForm = reduxForm({
  form: "imageForm",
})(ImageLoadForm);

// how to show that we dont pass the field validation before submitting ( or after )
// field-level validation
const FormControl = ({
  input,
  meta: { touched, error, warning },
  children,
}) => {
  // children = <input {...input} {...restProps} /> or children = <input {...input} {...restProps} />
  const hasError = touched && error;
  const hasWarn = touched && warning;
  return (
    <div
      className={
        styles.formControl +
        " " +
        (hasError ? styles.error : "") +
        " " +
        (hasWarn ? styles.warning : "")
      }
    >
      {children}
      {(hasError && <span>{error}</span>) ||
        (hasWarn && <span>{warning}</span>)}
      {/* </div> */}
    </div>
  );
};

export const TextArea = (props) => {
  const { input, meta, child, ...restProps } = props;
  console.log(restProps.onCTRLEnt);
  return (
    <FormControl {...props}>
      <textarea {...input} {...restProps} onKeyUp={restProps.onCTRLEnt} />
    </FormControl>
  );
};

export const Input = (props) => {
  const { input, meta, child, ...restProps } = props;
  return (
    <FormControl {...props}>
      <input {...input} {...restProps} />
    </FormControl>
  );
};

export const HollowInput = (props) => {
  const { input, meta, child, ...restProps } = props;
  return (
    <FormControl {...props}>
      <input {...input} {...restProps} readOnly={true} />
    </FormControl>
  );
};

// export const InputImageLink = (props) => {
//   const { input, meta, child, link, ...restProps } = props;
//   if (link) {
//     console.log(link);
//     return (
//       <>
//         <input {...input} {...restProps} value={link[0]} readOnly={true} />
//         <br />
//         <input
//           {...input}
//           {...restProps}
//           name="localPhoto"
//           value={link[1]}
//           readOnly={true}
//         />
//       </>
//     );
//   } else {
//     return (
//       <FormControl {...props}>
//         <input {...input} {...restProps} readOnly />
//       </FormControl>
//     );
//   }
// };

export const FileInput = (props) => {
  const { input, meta, child, ...restProps } = props;

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onFileChange = async (e) => {
    const { input } = props;
    const targetFile = e.target.files[0];
    if (targetFile) {
      const val = await getBase64(targetFile);
      input.onChange({ fileURL: val, fileName: targetFile.name });
    } else {
      input.onChange(null);
    }
  };

  const fileInputKey = input.value ? input.value.name : +new Date();

  return <input key={fileInputKey} type="file" onChange={onFileChange} />;
};
export const createField = (
  placeholder,
  name,
  component,
  validators,
  props = {},
  text = ""
) => {
  return (
    <div className="">
      <Field
        placeholder={placeholder}
        name={name}
        component={component}
        validate={validators}
        {...props}
      />
      {text}
    </div>
  );
};
