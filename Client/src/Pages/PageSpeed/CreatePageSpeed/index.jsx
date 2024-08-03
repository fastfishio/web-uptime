import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Field from "../../../Components/Inputs/Field";
import Select from "../../../Components/Inputs/Select";
import Button from "../../../Components/Button";
import Checkbox from "../../../Components/Inputs/Checkbox";
import { monitorValidation } from "../../../Validation/validation";
import { createToast } from "../../../Utils/toastUtils";
import { createPageSpeed } from "../../../Features/PageSpeedMonitor/pageSpeedMonitorSlice";
import WestRoundedIcon from "@mui/icons-material/WestRounded";
import "./index.css";

const CreatePageSpeed = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const MS_PER_MINUTE = 60000;
  const { user, authToken } = useSelector((state) => state.auth);

  const frequencies = [
    { _id: 1, name: "1 minute" },
    { _id: 1440, name: "1 day" },
    { _id: 2880, name: "2 days" },
    { _id: 4320, name: "3 days" },
    { _id: 7200, name: "5 days" },
    { _id: 10080, name: "1 week" },
  ];

  const [form, setForm] = useState({
    name: "",
    url: "",
    interval: 1,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event, id) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [id]: value }));

    const { error } = monitorValidation.validate(
      { [id]: value },
      { abortEarly: false }
    );

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) newErrors[id] = error.details[0].message;
      else delete newErrors[id];
      return newErrors;
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    let monitor = {
      url: "http://" + form.url,
      name: form.name === "" ? form.url : form.name,
    };

    const { error } = monitorValidation.validate(form, { abortEarly: false });

    if (error) {
      const newErrors = {};
      error.details.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      createToast({ body: "Error validating data." });
    } else {
      monitor = {
        ...monitor,
        description: monitor.name,
        userId: user._id,
        interval: form.interval * MS_PER_MINUTE,
        type: "pagespeed",
      };
      try {
        const action = await dispatch(createPageSpeed({ authToken, monitor }));
        if (action.meta.requestStatus === "fulfilled") {
          navigate("/pagespeed");
        }
      } catch (error) {
        createToast({
          body:
            error.details && error.details.length > 0
              ? error.details[0].message
              : "Unknown error.",
        });
      }
    }
  };

  return (
    <Box className="create-page-speed">
      <Button
        level="tertiary"
        label="Back"
        animate="slideLeft"
        img={<WestRoundedIcon />}
        onClick={() => navigate("/pagespeed")}
        sx={{
          backgroundColor: theme.palette.otherColors.fillGray,
          mb: theme.gap.large,
          px: theme.gap.ml,
          "& svg.MuiSvgIcon-root": {
            mr: theme.gap.small,
            fill: theme.palette.otherColors.slateGray,
          },
        }}
      />
      <form
        noValidate
        spellCheck="false"
        onSubmit={handleCreate}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.gap.large,
          // TODO
          maxWidth: "1000px",
        }}
      >
        <Typography component="h1">Create a page speed monitor</Typography>
        <Stack gap={theme.gap.xl}>
          <Stack direction="row">
            <Typography component="h3">Monitor friendly name</Typography>
            <Field
              type="text"
              id="monitor-name"
              placeholder="Example monitor"
              value={form.name}
              onChange={(event) => handleChange(event, "name")}
              error={errors.name}
            />
          </Stack>
          <Stack direction="row">
            <Typography component="h3">URL</Typography>
            <Field
              type="url"
              id="monitor-url"
              placeholder="random.website.com"
              value={form.url}
              onChange={(event) => handleChange(event, "url")}
              error={errors.url}
            />
          </Stack>
          <Stack direction="row">
            <Typography component="h3">Check frequency</Typography>
            <Select
              id="monitor-frequency"
              items={frequencies}
              value={form.interval}
              onChange={(event) => handleChange(event, "interval")}
            />
          </Stack>
          <Stack direction="row">
            <Typography component="h3">
              Incidents notifications{" "}
              <Typography component="span">(coming soon)</Typography>
            </Typography>
            <Stack className="section-disabled">
              <Typography mb={theme.gap.small}>
                When there is a new incident,
              </Typography>
              <Checkbox
                id="notify-sms"
                label="Notify via SMS (coming soon)"
                isChecked={false}
                isDisabled={true}
              />
              <Checkbox
                id="notify-email"
                label="Notify via email (to gorkem.cetin@bluewavelabs.ca)"
                isChecked={false}
              />
              <Checkbox
                id="notify-emails"
                label="Notify via email to following emails"
                isChecked={false}
              />
              <Box mx={`calc(${theme.gap.ml} * 2)`}>
                <Field
                  id="notify-emails-list"
                  placeholder="notifications@gmail.com"
                  value=""
                  onChange={() => console.log("disabled")}
                  error=""
                />
                <Typography mt={theme.gap.small}>
                  You can separate multiple emails with a comma
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Button
            type="submit"
            level="primary"
            label="Create"
            onClick={handleCreate}
            sx={{ px: theme.gap.large, mt: theme.gap.large }}
          />
        </Stack>
      </form>
    </Box>
  );
};

export default CreatePageSpeed;
