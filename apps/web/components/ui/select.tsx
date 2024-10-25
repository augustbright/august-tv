'use client';

import { cn } from '@/lib/utils';

import { ChevronDown, X } from 'lucide-react';
import React from 'react';
import {
  ClearIndicatorProps,
  DropdownIndicatorProps,
  GroupBase,
  MenuProps,
  MultiValueRemoveProps,
  OptionProps,
  components
} from 'react-select';
import AsyncSelectOriginal, { AsyncProps } from 'react-select/async';
import AsyncCreatableSelectOriginal, {
  AsyncCreatableProps
} from 'react-select/async-creatable';
import Select from 'react-select/dist/declarations/src/Select';

const DropdownIndicator = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: DropdownIndicatorProps<Option, IsMulti, Group>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className='h-4 w-4' />
    </components.DropdownIndicator>
  );
};

const ClearIndicator = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: ClearIndicatorProps<Option, IsMulti, Group>
) => {
  return (
    <components.ClearIndicator {...props}>
      <X className='h-4 w-4' />
    </components.ClearIndicator>
  );
};

const MultiValueRemove = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: MultiValueRemoveProps<Option, IsMulti, Group>
) => {
  return (
    <components.MultiValueRemove {...props}>
      <X className='h-4 w-4' />
    </components.MultiValueRemove>
  );
};

const Option = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: OptionProps<Option, IsMulti, Group>
) => {
  return (
    <components.Option {...props}>
      {props.children}
      {props.isSelected && (
        <span className='ml-2 text-gray-500'>(current)</span>
      )}
    </components.Option>
  );
};

const controlStyles = {
  base: 'flex min-h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50',
  focus: 'outline-none ring-2 ring-ring ring-offset-2',
  nonFocus: ''
};
const placeholderStyles = 'text-muted-foreground pl-2 py-0.5';
const selectInputStyles = 'pl-1 py-0.5';
const valueContainerStyles = 'p-1 gap-1';
const singleValueStyles = 'leading-7 ml-1';
const multiValueStyles =
  'inline-flex gap-2 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground';
const multiValueLabelStyles = 'leading-4 py-0.5';
const multiValueRemoveStyles =
  'hover:bg-accent hover:text-foreground text-muted rounded-full';
const indicatorsContainerStyles = 'p-1 gap-1';
const clearIndicatorStyles =
  'text-muted p-1 rounded-full hover:bg-accent hover:text-foreground';
const indicatorSeparatorStyles = '';
const dropdownIndicatorStyles =
  'cursor-pointer p-1 text-gray-500 rounded-md hover:bg-accent hover:text-accent-foreground ';
const menuStyles =
  'mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2';
const groupHeadingStyles = 'ml-3 mt-2 mb-1 text-gray-500 text-sm';
const optionStyles = {
  base: 'hover:cursor-pointer px-3 py-2 rounded',
  focus: 'bg-accent active:bg-accent',
  selected: 'after:content after:ml-2 text-gray-500'
};
const noOptionsMessageStyles = 'text-gray-500 p-2 border-gray-200 rounded-sm';

export const AsyncCreatableSelect = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: AsyncCreatableProps<Option, IsMulti, Group> &
    React.RefAttributes<Select<Option, IsMulti, Group>> & {
      maxSelections?: number;
      maxSelectionsMessage?: React.ReactNode;
    }
) => {
  const Menu = (menuProps: MenuProps<Option, IsMulti, Group>) => {
    let content = menuProps.children;
    if (
      props.maxSelections &&
      menuProps.getValue().length >= props.maxSelections
    ) {
      content = (
        <components.NoOptionsMessage {...menuProps}>
          {props.maxSelectionsMessage ||
            `You can only select up to ${props.maxSelections} items`}
        </components.NoOptionsMessage>
      );
    }
    return <components.Menu {...menuProps}>{content}</components.Menu>;
  };

  return (
    <AsyncCreatableSelectOriginal<Option, IsMulti, Group>
      {...props}
      unstyled
      styles={{
        input: (base) => ({
          ...base,
          'input:focus': {
            boxShadow: 'none'
          }
        }),
        // On mobile, the label will truncate automatically, so we want to
        // override that behavior.
        multiValueLabel: (base) => ({
          ...base,
          whiteSpace: 'normal',
          overflow: 'visible'
        }),
        control: (base) => ({
          ...base,
          transition: 'none'
        })
      }}
      components={{
        DropdownIndicator,
        ClearIndicator,
        MultiValueRemove,
        Menu
      }}
      menuPortalTarget={document.body}
      menuPosition='fixed'
      classNames={{
        control: ({ isFocused }) =>
          cn(
            isFocused ? controlStyles.focus : controlStyles.nonFocus,
            controlStyles.base
          ),
        placeholder: () => placeholderStyles,
        input: () => selectInputStyles,
        valueContainer: () => valueContainerStyles,
        singleValue: () => singleValueStyles,
        multiValue: () => multiValueStyles,
        multiValueLabel: () => multiValueLabelStyles,
        multiValueRemove: () => multiValueRemoveStyles,
        indicatorsContainer: () => indicatorsContainerStyles,
        clearIndicator: () => clearIndicatorStyles,
        indicatorSeparator: () => indicatorSeparatorStyles,
        dropdownIndicator: () => dropdownIndicatorStyles,
        menuPortal: () => '!z-50 pointer-events-auto',
        menu: () => menuStyles,
        groupHeading: () => groupHeadingStyles,
        option: ({ isFocused, isSelected }) =>
          cn(
            isFocused && optionStyles.focus,
            isSelected && optionStyles.selected,
            optionStyles.base
          ),
        noOptionsMessage: () => noOptionsMessageStyles
      }}
    />
  );
};

export const AsyncSelect = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: AsyncProps<Option, IsMulti, Group> &
    React.RefAttributes<Select<Option, IsMulti, Group>>
) => {
  return (
    <AsyncSelectOriginal<Option, IsMulti, Group>
      {...props}
      unstyled
      styles={{
        input: (base) => ({
          ...base,
          'input:focus': {
            boxShadow: 'none'
          }
        }),
        // On mobile, the label will truncate automatically, so we want to
        // override that behavior.
        multiValueLabel: (base) => ({
          ...base,
          whiteSpace: 'normal',
          overflow: 'visible'
        }),
        control: (base) => ({
          ...base,
          transition: 'none'
        })
      }}
      menuPortalTarget={document.body}
      menuPosition='fixed'
      components={{
        DropdownIndicator,
        ClearIndicator,
        MultiValueRemove,
        Option
      }}
      classNames={{
        control: ({ isFocused }) =>
          cn(
            isFocused ? controlStyles.focus : controlStyles.nonFocus,
            controlStyles.base
          ),
        placeholder: () => placeholderStyles,
        input: () => selectInputStyles,
        valueContainer: () => valueContainerStyles,
        singleValue: () => singleValueStyles,
        multiValue: () => multiValueStyles,
        multiValueLabel: () => multiValueLabelStyles,
        multiValueRemove: () => multiValueRemoveStyles,
        indicatorsContainer: () => indicatorsContainerStyles,
        clearIndicator: () => clearIndicatorStyles,
        indicatorSeparator: () => indicatorSeparatorStyles,
        dropdownIndicator: () => dropdownIndicatorStyles,
        menuPortal: () => '!z-50 pointer-events-auto',
        menu: () => menuStyles,
        groupHeading: () => groupHeadingStyles,
        option: ({ isFocused, isSelected }) =>
          cn(
            isFocused && optionStyles.focus,
            isSelected && optionStyles.selected,
            optionStyles.base
          ),
        noOptionsMessage: () => noOptionsMessageStyles
      }}
    />
  );
};
