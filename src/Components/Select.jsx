import { useEffect, useState } from 'react';

import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
/* eslint-disable react/prop-types */
import { Combobox } from '@headlessui/react';

const Select = ({ options, value, placeholder, label, onChange }) => {
    const [localOptions, setLocalOptions] = useState([]);

    useEffect(() => {
        setLocalOptions(options);
    }, [options]);

    return (
        <Combobox
            className={'w-full'}
            as="div"
            onChange={(val) => onChange(val)}>
            <div className="relative mt-2">
                <Combobox.Label className={'text-left'}>{label}</Combobox.Label>
                <Combobox.Button className="relative w-full">
                    <Combobox.Input
                        placeholder={placeholder}
                        className="block w-full rounded-xl border-0 bg-zinc-100 px-5 py-4 font-light text-black outline outline-[1px] outline-zinc-400 placeholder:text-black/70 focus:outline-none focus:ring-[3px] focus:ring-sky-500"
                        onChange={(e) => {
                            setLocalOptions(
                                options.filter((op) =>
                                    op.label.includes(e.target.value)
                                )
                            );
                        }}
                        displayValue={(option) => option?.label}
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-zinc-400"
                            aria-hidden="true"
                        />
                    </span>
                </Combobox.Button>

                {localOptions.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white p-2 text-base text-black shadow-lg outline outline-[1px] outline-zinc-400 ring-opacity-5 focus:outline-none sm:text-sm">
                        {localOptions.map((option) => (
                            <Combobox.Option
                                key={option.value}
                                value={option}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none rounded-2xl py-4 pl-3 pr-9 ${
                                        active
                                            ? 'bg-gray-300 text-black'
                                            : 'text-black'
                                    }`
                                }>
                                {({ active, selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${
                                                selected ? 'font-semibold' : ''
                                            }`}>
                                            {option.label}
                                        </span>

                                        {selected && (
                                            <span
                                                className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                                    active
                                                        ? 'text-black'
                                                        : 'text-indigo-600'
                                                }`}>
                                                <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
        </Combobox>
    );
};

export default Select;
