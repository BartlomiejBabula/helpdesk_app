export const samboDbConfig = {
  user: process.env.SAMBODB_USER,
  password: process.env.SAMBODB_PASSWORD,
  poolMin: 20,
  poolIncrement: 0,
  poolMax: 20,
  connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.SAMBODB_IP})(PORT=${process.env.SAMBODB_PORT}))(CONNECT_DATA=(SERVER=DEDICATED)(SID=${process.env.SAMBODB_SID})))`,
};
