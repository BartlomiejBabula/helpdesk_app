import { Box, Typography, Divider, Stack } from "@mui/material";

interface TableType {
  titleColumnsArray: string[];
  dataArray: any[];
  widthColumnsArray: any[];
}
const FormattedTable = ({
  titleColumnsArray,
  dataArray,
  widthColumnsArray,
}: TableType) => {
  return (
    <Box>
      <Stack direction='row'>
        {titleColumnsArray.map((title: string, i: number) => (
          <Typography
            key={i}
            sx={{ color: "grey", fontSize: 12.5, width: widthColumnsArray[i] }}
          >
            {title}
          </Typography>
        ))}
      </Stack>
      <Divider sx={{ marginBottom: 1 }} />
      {dataArray.map((data: string, i: number) => (
        <Stack direction='row' key={i} sx={{ marginBottom: 1 }}>
          <Typography
            key={1}
            sx={{ fontSize: 12.5, width: widthColumnsArray[0] }}
          >
            {data[0]}
          </Typography>
          {titleColumnsArray.map((column: any, k: number) => (
            <Typography
              key={k + 1}
              sx={{ fontSize: 12.5, width: widthColumnsArray[1 + k] }}
            >
              {data ? data[k + 1] : 0}
            </Typography>
          ))}
        </Stack>
      ))}
    </Box>
  );
};

export default FormattedTable;
