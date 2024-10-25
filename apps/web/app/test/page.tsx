'use client';

import { Guard, RedirectHome } from '@/components/guard';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { ChevronDown, X } from 'lucide-react';
import {
  ClearIndicatorProps,
  DropdownIndicatorProps,
  MultiValueRemoveProps,
  components
} from 'react-select';
import AsyncCreatableSelect from 'react-select/async-creatable';

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className='h-4 w-4' />
    </components.DropdownIndicator>
  );
};

const ClearIndicator = (props: ClearIndicatorProps) => {
  return (
    <components.ClearIndicator {...props}>
      <X className='h-4 w-4' />
    </components.ClearIndicator>
  );
};

const MultiValueRemove = (props: MultiValueRemoveProps) => {
  return (
    <components.MultiValueRemove {...props}>
      <X className='h-4 w-4' />
    </components.MultiValueRemove>
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
  'hover:bg-accent hover:text-foreground text-muted rounded-md';
const indicatorsContainerStyles = 'p-1 gap-1';
const clearIndicatorStyles =
  'text-muted p-1 rounded-md hover:bg-accent hover:text-foreground';
const indicatorSeparatorStyles = '';
const dropdownIndicatorStyles =
  'cursor-pointer p-1 text-gray-500 rounded-md hover:bg-accent hover:text-accent-foreground ';
const menuStyles =
  'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2';
const groupHeadingStyles = 'ml-3 mt-2 mb-1 text-gray-500 text-sm';
const optionStyles = {
  base: 'hover:cursor-pointer px-3 py-2 rounded',
  focus: 'bg-accent active:bg-gray-200',
  selected: "after:content-['✔'] after:ml-2 after:text-green-500 text-gray-500"
};
const noOptionsMessageStyles = 'text-gray-500 p-2 border-gray-200 rounded-sm';

export default function TestPage() {
  return (
    <Guard
      roles={['admin']}
      fallback={<RedirectHome />}
    >
      <div className='grid grid-cols-12'>
        <div className='col-start-4 col-end-10 flex flex-col gap-5 items-center'>
          <h1 className='text-2xl col-span-12 font-bold'>Test Page</h1>

          <Input placeholder='qwer' />

          <AsyncCreatableSelect
            unstyled
            isMulti
            className='w-full'
            cacheOptions
            isClearable
            styles={{
              input: (base) => ({
                ...base,
                'input:focus': {
                  boxShadow: 'none'
                }
              }),
              // On mobile, the label will truncate automatically, so we want to
              // override that behaviour.
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
            components={{ DropdownIndicator, ClearIndicator, MultiValueRemove }}
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
            loadOptions={async (query) => {
              return [
                { label: 'tag1', value: '1' },
                { label: 'tag2', value: '2' },
                { label: 'tag3', value: '3' },
                { label: 'tag4', value: '4' },
                { label: 'tag5', value: '5' },
                { label: 'tag6', value: '6' },
                { label: 'tag7', value: '7' },
                { label: 'tag8', value: '8' },
                { label: 'tag9', value: '9' },
                { label: 'tag10', value: '10' }
              ];
            }}
          />
        </div>
      </div>
    </Guard>
  );
}
