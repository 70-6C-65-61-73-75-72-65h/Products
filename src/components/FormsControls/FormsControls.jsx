import React, { useRef, useEffect } from "react";
import styles from "./FormsControls.module.scss";
import { Field } from "redux-form";
import PropTypes from "prop-types";
import uploadIcon from "../../assets/images/Upload-icon.png";

// field-level validation
const FormControl = ({
  input,
  meta: { touched, error, warning },
  children,
}) => {
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
    </div>
  );
};

export const TextArea = (props) => {
  const { input, meta, child, ...restProps } = props;
  return (
    <FormControl {...props}>
      <textarea {...input} {...restProps} ref={props.refa} />
    </FormControl>
  );
};

export function Input(props) {
  const { input, meta, child, ...restProps } = props;
  return (
    <FormControl {...props}>
      <input {...input} ref={props.refa} {...restProps} />
    </FormControl>
  );
}

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

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function ImageField({ ...props }) {
  const previewRef = useRef(null);

  const prevValue = usePrevious(props.meta.pristine);
  useEffect(() => {
    if (prevValue === false && props.meta.pristine === true) {
      previewRef.current.src = "";
    }
  }, [props.meta.pristine]);

  const handlePreview = (imageUrl) => {
    const previewImageDom = previewRef.current;
    previewImageDom.src = imageUrl;
  };

  const handleChange = (event, input) => {
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
      handlePreview(localImageUrl);
    }
    event.currentTarget.value = null;
  };

  const { input, meta, child, ...restProps } = props;
  return (
    <FormControl {...props}>
      <div className={styles.imgContainer}>
        <img
          src={""}
          alt={props.alt}
          className="preview-image"
          ref={previewRef}
        />
      </div>
      <label for={"thatImage"} className={styles.uploadIcon}>
        <img
          src={uploadIcon}
          style={{ width: "100px", height: "100px" }}
          alt={"nothing"}
        />
      </label>
      <input
        id={"thatImage"}
        name={input.name}
        style={{ opacity: 0, height: "0px" }}
        type="file"
        accept={props.mimeType}
        onChange={(event) => handleChange(event, input)}
        {...restProps}
      />
    </FormControl>
  );
}

ImageField.propTypes = {
  mimeType: PropTypes.string,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  // redux-form props
  handleSubmit: PropTypes.func.isRequired,
};
