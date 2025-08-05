import { Select } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";

export const SelectComponent = ({ allOption = [], option, value }) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(value || "");

  useEffect(() => {
    let options = allOption?.map((item) => ({
      value: item.instagramUsername,
      label: item.instagramUsername,
    }));

    if (options.length > 0) {
      options.unshift({ label: "Select an option", value: "" });
    } else {
      options = [{ label: "No option", value: "" }];
    }

    setOptions(options);
  }, [allOption]);

  // Sync external value prop with internal selected state
  useEffect(() => {
    if (value !== undefined && value !== selected) {
      setSelected(value);
    }
  }, [value]);

  const handleSelectChange = useCallback(
    (value) => {
      setSelected(value);
      option(value);
    },
    [option],
  );

  return (
    <Select
      label="Username"
      options={options}
      onChange={handleSelectChange}
      value={selected}
    />
  );
};
