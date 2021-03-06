import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {gql} from '@apollo/client'
import * as hooks from 'hooks'
import * as utils from 'utils'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Typography from '@material-ui/core/Typography'
import Page from 'components/Page'
import CircularProgress from '@material-ui/core/CircularProgress'
import {FormattedMessage} from 'react-intl'

const CREATE_ADDRESS = gql`
  mutation createAddress($dawaId: ID!) {
    createAddress(dawaId: $dawaId) {
      address {
        id
      }
    }
  }
`

export default function AddressesNew(props) {
  return (
    <Page title={{id: '@t.new_tenancy_page_title@@'}} headerText={{id: '@t.new_tenancy_header@@'}}>
      <AddressSearch />
    </Page>
  )
}

const AddressSearch = (props) => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [selectedAddress, setSelectedAddress] = React.useState(null)
  const [isCommitting, setCommitting] = React.useState(false)

  const client = hooks.useClient()
  const router = hooks.useRouter()
  const intl = hooks.useIntl()

  hooks.useDebounced(() => setDebouncedSearchTerm(searchTerm), 300, [searchTerm])

  const searchDAWA = (searchTerm) => {
    setLoading(true)
    fetch('https://dawa.aws.dk/adresser/autocomplete?fuzzy&q=' + encodeURIComponent(searchTerm))
      .then((response) => response.json())
      .then((addresses) => {
        if (Array.isArray(addresses)) {
          setOptions(addresses.map((address) => ({id: address.adresse.id, text: address.tekst})))
        } else {
          setOptions([])
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  React.useEffect(() => {
    if (debouncedSearchTerm.length) {
      searchDAWA(debouncedSearchTerm)
    } else {
      setOptions([])
    }
  }, [debouncedSearchTerm])

  return (
    <>
      <Box pt={2}>
        <Autocomplete
          style={{maxWidth: 500}}
          freeSolo
          inputValue={searchTerm}
          onInputChange={(_, searchTerm) => setSearchTerm(searchTerm)}
          onChange={(_, address) => {
            setSelectedAddress(address)
          }}
          openOnFocus
          filterOptions={(options) => options}
          getOptionSelected={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.text}
          options={options}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label={intl.formatMessage({id: '@t.new_tenancy_search_placeholder@@'})}
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password',
              }}
            />
          )}
        />
      </Box>
      <Box pt={2}>
        {isCommitting ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (!selectedAddress) return
              setCommitting(true)
              client
                .mutate({mutation: CREATE_ADDRESS, variables: {dawaId: selectedAddress.id}})
                .then(({data}) => {
                  router.push('/addresses/' + data.createAddress.address.id)
                })
                .catch((error) => {
                  utils.handleError(error)
                  setCommitting(false)
                })
            }}
          >
            <FormattedMessage id="@t.save@@" />
          </Button>
        )}
      </Box>
    </>
  )
}
