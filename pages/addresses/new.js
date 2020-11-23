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
import PageHeader from 'components/PageHeader'
import CircularProgress from '@material-ui/core/CircularProgress'

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
    <>
      <Head>
        <title>Suitable - Tilføj lejemål</title>
      </Head>
      <PageHeader>Tilføj lejemål</PageHeader>
      <AddressSearch />
    </>
  )
}

const AddressSearch = (props) => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [selectedAddress, setSelectedAddress] = React.useState(null)
  const [isCommitting, setCommitting] = React.useState(false)

  const client = hooks.useClient()
  const router = hooks.useRouter()

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
    if (searchTerm.length) {
      searchDAWA(searchTerm)
    } else {
      setOptions([])
    }
  }, [searchTerm])
  return (
    <>
      <Box pt={2}>
        <Autocomplete
          style={{width: 500}}
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
              label="Søg efter adresse"
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
            Gem
          </Button>
        )}
      </Box>
    </>
  )
}
