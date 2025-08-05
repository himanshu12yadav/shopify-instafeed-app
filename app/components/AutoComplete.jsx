import { Autocomplete, Icon, InlineStack, Select, Box } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";

function AutoComplete({
  captionList,
  filterOptions,
  setInputValue,
  setFilterValue,
  selectedAccount,
  searchTerm,
}) {
  const deselectedOptions = useMemo(
    () => [...(captionList || [])],
    [captionList],
  );
  const [selectedOptions, setSelectedOptions] = useState("");
  const [inputValue, setInternalInputValue] = useState(searchTerm || "");
  const [options, setOptions] = useState(deselectedOptions);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(
    filterOptions ? filterOptions[0].value : "all",
  );

  // console.log("Input value: ", inputValue);

  // Update internal input state when searchTerm prop changes
  useEffect(() => {
    if (searchTerm !== undefined && searchTerm !== inputValue) {
      setInternalInputValue(searchTerm);
    }

    if (searchTerm === "") {
      setSelectedOptions("");
    }
  }, [searchTerm]);

  // Handle filter change
  const handleFilterChange = useCallback(
    (value) => {
      setSelected(value);
      if (setFilterValue) {
        setFilterValue(value);
      }
    },
    [setFilterValue],
  );

  const updateText = useCallback(
    (value) => {
      setInternalInputValue(value);

      // Call the parent component's setInputValue
      if (setInputValue) {
        setInputValue(value);
      }

      if (!loading) {
        setLoading(true);
      }

      setTimeout(() => {
        if (value === "") {
          setOptions(deselectedOptions);
          setLoading(false);
          return;
        }

        const filterRegex = new RegExp(value, "i");
        const resultOptions = deselectedOptions.filter((option) =>
          option.label.match(filterRegex),
        );

        setOptions(resultOptions);
        setLoading(false);
      }, 300);
    },
    [deselectedOptions, loading, setInputValue],
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedText = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });

        return matchedOption && matchedOption.label;
      });

      setSelectedOptions(selected);
      setInternalInputValue(selectedText[0] || "");

      // Call the parent component's setInputValue
      if (setInputValue) {
        setInputValue(selectedText[0] || "");
      }
    },
    [options, setInputValue],
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      value={inputValue}
      prefix={<Icon source={SearchIcon} tone="base" />}
      placeholder="Search captions"
      autoComplete="off"
      clearButton
      onClearButtonClick={() => {
        setInternalInputValue("");
        setSelectedOptions("");
        if (setInputValue) {
          setInputValue("");
        }
      }}
    />
  );

  return (
    <div>
      <InlineStack gap="400" align="start" blockAlign="center">
        {filterOptions && (
          <Box minWidth="200px">
            <Select
              label="Filter by type"
              labelHidden
              options={filterOptions}
              onChange={handleFilterChange}
              value={selected}
            />
          </Box>
        )}
        <Box style={{ flex: 1 }}>
          <Autocomplete
            options={options}
            selected={selectedOptions}
            onSelect={updateSelection}
            loading={loading}
            textField={textField}
          />
        </Box>
      </InlineStack>
    </div>
  );
}

export { AutoComplete };
