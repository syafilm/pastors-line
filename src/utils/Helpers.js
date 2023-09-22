const checkValidExist = value => {
  let isValid;
  if (/^\s*$/.test(value)) {
    isValid = false;
  } else if (/^\d+$/.test(value)) {
    isValid = value > 0;
  } else if (/^\s+$/.test(value)) {
    isValid = value.length > 0;
  } else {
    isValid = !!value;
  }

  return isValid;
};

function checkImage(data) {
  let isValid = false
  if (data.includes('jpg')
     || data.includes('jpeg')
     || data.includes('png')
     || data.includes('gif')) {
       isValid = true
  }

  return isValid ? '' : 'file should be image'
}


const Helpers = {
  checkValidExist,
  checkImage,
}

export default Helpers