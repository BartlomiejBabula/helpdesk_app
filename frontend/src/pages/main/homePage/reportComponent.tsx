import { useState, useEffect } from "react";
import { Paper, Button, Typography, Grid } from "@mui/material";
import api from "../../../api/api";
import { AlertProps } from "@mui/material/Alert";
import SnackbarAlert from "../../../components/SnackbarAlert";
import { ModalStoreList } from "./storeListModal";
import { ModalJiraSLA } from "./jiraSLAModal";
import { useAppDispatch, useAppSelector } from "../../../redux/AppStore";
import { reportsSelector } from "../../../redux/reports/ReportsSlice";
import { getBlockedReports } from "../../../redux/reports/getBlockedReports";

const raportList: { name: string; btt: string }[] = [
  { name: "RAPORT PORANNY", btt: "morning" },
  { name: "RAPORT WOLUMETRYKA", btt: "volumetrics" },
  { name: "RAPORT JIRA SLA", btt: "jiraSLA" },
  { name: "TESTY SELENIUM", btt: "selenium" },
  { name: "LISTA SKLEPÓW", btt: "storeList" },
];

export const Report = () => {
  const dispatch = useAppDispatch();
  const blockReports = useAppSelector(reportsSelector);
  const [openModal, setModalOpen] = useState(false);
  const [openModalStoreList, setModalOpenStoreList] = useState(false);
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleOpenModal = () => setModalOpen(true);
  const handleOpenModalStoreList = () => setModalOpenStoreList(true);

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalOpenStoreList(false);
  };

  const handleRaportGenerate = async (button: string) => {
    switch (button) {
      case "RAPORT PORANNY":
        await api.get(`/reports/morning`);
        dispatch(getBlockedReports());
        setSnackbar({
          children:
            "Zlecono generacje raportu - raport zostanie wysłany na twojego maila",
          severity: "success",
        });
        break;
      case "RAPORT WOLUMETRYKA":
        await api.get(`/reports/volumetrics`);
        dispatch(getBlockedReports());
        setSnackbar({
          children:
            "Zlecono generacje raportu - raport zostanie wysłany na twojego maila",
          severity: "success",
        });
        break;
      case "RAPORT JIRA SLA":
        handleOpenModal();
        break;
      case "TESTY SELENIUM":
        await api.get(`/reports/selenium`); // dla dev /reports/selenium-dev
        dispatch(getBlockedReports());
        setSnackbar({
          children:
            "Uruchomiono selenium - raport zostanie wysłany na twojego maila",
          severity: "success",
        });
        break;
      case "LISTA SKLEPÓW":
        handleOpenModalStoreList();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(getBlockedReports());
  }, [dispatch]);

  return (
    <Paper
      variant='outlined'
      sx={{
        padding: 1,
        marginTop: 4,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant='subtitle1'
        sx={{
          marginLeft: 1,
          letterSpacing: 1,
          color: "#38373D",
          marginBottom: 2,
          fontWeight: "medium",
        }}
      >
        Generowanie ręczne
      </Typography>
      <Grid sx={{ paddingLeft: 3 }} container rowSpacing={1.5} flexWrap='wrap'>
        {raportList.map((raport, id) => (
          <Grid item key={id} xs={4}>
            <Button
              key={id}
              variant='contained'
              size='large'
              style={{
                marginBottom: 10,
                width: "24vw",
                minWidth: 250,
                backgroundImage:
                  "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
              }}
              disabled={
                blockReports.blocked?.includes(raport.btt) ? true : false
              }
              onClick={() => {
                handleRaportGenerate(raport.name);
              }}
            >
              <Typography noWrap fontWeight={"500"}>
                {raport.name}
              </Typography>
            </Button>
          </Grid>
        ))}
        <SnackbarAlert alert={snackbar} />
      </Grid>
      <ModalJiraSLA
        isOpen={openModal}
        close={handleCloseModal}
        setSnackbar={setSnackbar}
      />
      <ModalStoreList
        isOpen={openModalStoreList}
        close={handleCloseModal}
        setSnackbar={setSnackbar}
      />
    </Paper>
  );
};
