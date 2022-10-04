var AWS = require('aws-sdk');
var fs = require('fs');

AWS.config.update({
  accessKeyId: process.env.AWS_Access_Key_ID,
  secretAccessKey: process.env.AWS_Secret_Access_Key,
});

const s3 = new AWS.S3();

const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: process.env.S3_BUCKET,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`,
  };
  return s3.upload(params).promise();
};

const downloadFile = async (filename) => {
    try {
      const res = await s3.getObject({ Bucket: process.env.S3_BUCKET, Key: filename }).promise();
      return { success: true, data: res.Body }
    } catch(error) {
      return { success: false, data: null }
    }
  }

const listFiles = async () => {
  try {
    const files = await s3
      .listObjectsV2({ Bucket: process.env.S3_BUCKET })
      .promise();
    const names = files.Contents.map((file) => file.Key);
    return { success: true, data: names }
  } catch (error) {
    return { success: false, data: null }
  }
};

module.exports = {
  uploadFile,
  downloadFile,
  listFiles,
};
