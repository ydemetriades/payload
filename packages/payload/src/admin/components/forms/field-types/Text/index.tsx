import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Props } from './types'
import { Option } from '../../../elements/ReactSelect/types'
import ReactSelect from '../../../elements/ReactSelect'

import { text } from '../../../../../fields/validations'
import { useConfig } from '../../../utilities/Config'
import { useLocale } from '../../../utilities/Locale'
import useField from '../../useField'
import withCondition from '../../withCondition'
import { isFieldRTL } from '../shared'
import TextInput from './Input'

const Text: React.FC<Props> = (props) => {
  const {
    name,
    hasMany,
    minRows,
    maxRows,
    admin: {
      className,
      components: { Error, Label, afterInput, beforeInput } = {},
      condition,
      description,
      placeholder,
      readOnly,
      rtl,
      style,
      width,
    } = {},
    inputRef,
    label,
    localized,
    maxLength,
    minLength,
    path: pathFromProps,
    required,
    validate = text,
  } = props

  const path = pathFromProps || name
  const locale = useLocale()

  const { localization } = useConfig()
  const { t } = useTranslation()
  const isRTL = isFieldRTL({
    fieldLocalized: localized,
    fieldRTL: rtl,
    locale,
    localizationConfig: localization || undefined,
  })

  const memoizedValidate = useCallback(
    (value, options) => {
      return validate(value, { ...options, maxLength, minLength, required })
    },
    [validate, minLength, maxLength, required],
  )

  const { errorMessage, setValue, showError, value } = useField<string | string[]>({
    condition,
    path,
    validate: memoizedValidate,
  })

  const [valueToRender, setValueToRender] = useState<
    { label: string; value: { value: number }; id: string }[]
  >([]) // Only for hasMany

  const handleHasManyChange = useCallback(
    (selectedOption) => {
      if (!readOnly) {
        let newValue
        if (!selectedOption) {
          newValue = []
        } else if (Array.isArray(selectedOption)) {
          newValue = selectedOption.map((option) => Number(option.value?.value || option.value))
        } else {
          newValue = [Number(selectedOption.value?.value || selectedOption.value)]
        }

        setValue(newValue)
      }
    },
    [readOnly, setValue],
  )

  // useeffect update valueToRender:
  useEffect(() => {
    if (hasMany && Array.isArray(value)) {
      setValueToRender(
        value.map((val, index) => {
          return {
            label: `${val}`,
            value: {
              value: (val as any)?.value || val,
              toString: () => `${val}${index}`,
            }, // You're probably wondering, why the hell is this done that way? Well, React-select automatically uses "label-value" as a key, so we will get that react duplicate key warning if we just pass in the value as multiple values can be the same. So we need to append the index to the toString() of the value to avoid that warning, as it uses that as the key.
            id: `${val}${index}`, // append index to avoid duplicate keys but allow duplicate numbers
          }
        }),
      )
    }
  }, [value, hasMany])

  return (
    <div>
      {hasMany ? (
        <ReactSelect
          className={`field-${path.replace(/\./gi, '__')}`}
          placeholder={
            typeof placeholder === 'string' && placeholder ? placeholder : t('general:enterAValue')
          }
          onChange={handleHasManyChange}
          value={valueToRender as Option[]}
          showError={showError}
          disabled={readOnly}
          options={[]}
          isCreatable
          isMulti
          isSortable
          isClearable
        />
      ) : (
        <TextInput
          Error={Error}
          Label={Label}
          afterInput={afterInput}
          beforeInput={beforeInput}
          className={className}
          description={description}
          errorMessage={errorMessage}
          inputRef={inputRef}
          label={label}
          name={name}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          path={path}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          rtl={isRTL}
          showError={showError}
          style={style}
          value={typeof value === 'string' ? value : ''}
          width={width}
        />
      )}
    </div>
  )
}

export default withCondition(Text)
