import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Fade,
  Backdrop,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material";
import api from "../../../api/api";
import { useFormik } from "formik";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";

const storeType: { name: string; value: string }[] = [
  { name: "Sieciowe", value: "'N'" },
  { name: "Franczyzowe", value: "'F'" },
  { name: "MultieSambo", value: "'U'" },
  { name: "Hipermarkety", value: "'H'" },
];

interface formikValues {
  type: string;
  storeType: any;
}

export const ModalStoreList = ({
  isOpen,
  close,
  setSnackbar,
}: {
  isOpen: boolean;
  setSnackbar: any;
  close: any;
}) => {
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    formikStoreList.resetForm();
    close();
  };

  const formikStoreList = useFormik({
    validationSchema: yup.object().shape({
      type: yup.string().required("Pole obowiązkowe"),
      storeType: yup.array().min(1, "Pole obowiązkowe"),
    }),

    initialValues: {
      type: "'A'",
      storeType: ["'N'"],
    },

    onSubmit: async (values: formikValues, { resetForm }) => {
      setLoading(true);
      const req = {
        type: values.type,
        storeType: values.storeType.join(", "),
      };

      await api
        .post(`stores/store-list`, req)
        .then((response) => {
          const element = document.createElement("a");
          const file = new Blob([response.data.join("\n")], {
            type: "text/plain",
            endings: "native",
          });
          element.href = URL.createObjectURL(file);
          element.download = "Lista Sklepów.txt";
          document.body.appendChild(element); // Required for this to work in FireFox
          element.click();
        })
        .catch((error) => {
          setSnackbar({
            children: "Ups coś poszło nie tak - nie pobrano listy sklepów",
            severity: "error",
          });
        });
      setLoading(false);
      handleCloseModal();
    },
  });

  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 425,
            borderRadius: 1,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <CloseIcon
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "black",
              cursor: "pointer",
              fontSize: 20,
            }}
            onClick={handleCloseModal}
          />
          <Typography variant='h6' component='h2'>
            Parametry generacji listy sklepów
          </Typography>
          <Typography
            variant='subtitle2'
            sx={{
              marginBottom: 4,
              marginTop: 3,
              color: "rgba(0, 0, 0, 0.6)",
              paddingX: 3,
            }}
          >
            Zostanie wygenerowany oraz pobrany plik tekstowy z listą sklepów,
            zgodną z podanymi poniżej parametrami.
          </Typography>
          <form onSubmit={formikStoreList.handleSubmit}>
            <Select
              sx={{ width: 300, marginBottom: 3 }}
              id='type'
              name='type'
              value={formikStoreList.values.type}
              onChange={formikStoreList.handleChange}
              error={
                formikStoreList.touched.type &&
                Boolean(formikStoreList.errors.type)
              }
              native
              autoFocus
            >
              <option value="'A'">Aktywne</option>
              <option value="'N'">Nieaktywne</option>
              <option value="'A', 'N'">Wszystkie</option>
            </Select>

            <FormControl sx={{ width: 300 }}>
              <Select
                multiple
                value={formikStoreList.values.storeType}
                error={
                  formikStoreList.touched.storeType &&
                  Boolean(formikStoreList.errors.storeType)
                }
                onChange={(e) => {
                  formikStoreList.setFieldValue("storeType", e.target.value);
                }}
              >
                {storeType.map((type) => (
                  <MenuItem key={type.name} value={type.value}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography sx={{ color: "red", fontSize: 13, marginTop: 1 }}>
              {formikStoreList.touched.storeType &&
                Boolean(formikStoreList.errors.storeType) &&
                `${formikStoreList.errors.storeType}`}
            </Typography>
            <Button
              sx={{
                letterSpacing: 2,
                height: 42,
                width: 200,
                marginTop: 5,
                backgroundImage:
                  "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
              }}
              type='submit'
              variant='contained'
            >
              {loading ? (
                <CircularProgress sx={{ color: "white" }} size={24} />
              ) : (
                "Pobierz plik"
              )}
            </Button>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};
