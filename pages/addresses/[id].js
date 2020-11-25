import React from 'react'
import Head from 'next/head'
import {gql} from '@apollo/client'
import * as hooks from 'hooks'
import * as utils from 'utils'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Link from 'next/link'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Page from 'components/Page'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import {FormattedMessage} from 'react-intl'
import GoogleMapReact from 'google-map-react'

const GET_ADDRESS = gql`
  query getAddress($id: ID!) {
    address(id: $id) {
      id
      dawa_id
      name
      postal_code
      city
      street
      number
      floor
      extra
      lng
      lat
      matrikelnr
    }
  }
`

const DELETE_ADDRESS = gql`
  mutation deleteAddress($id: ID!) {
    deleteAddress(id: $id) {
      address {
        id
      }
    }
  }
`

function AddressPage(props) {
  const router = hooks.useRouter()
  const query = hooks.useQuery(GET_ADDRESS, {variables: {id: router.query.id}, fetchPolicy: 'cache-and-network'})
  const address = query.data?.address

  return (
    <Page title={{id: '@t.tenancy_page_title@@'}} headerText={{id: '@t.tenancy_header@@'}}>
      {query.loading && !address && <CircularProgress />}
      {address && <Address address={address} />}
    </Page>
  )
}

function Address(props) {
  const {address} = props

  return (
    <>
      <Box pt={2}>
        <Typography>
          <FormattedMessage id="@t.address_entry@@" values={{address: address.name}} />
        </Typography>
        <Box pt={2}>
          <DeleteButton address={address} />
        </Box>
        <Box pt={2}>
          <Map address={address} />
        </Box>
      </Box>
    </>
  )
}

const Map = (props) => {
  const {address} = props
  return (
    <div style={{height: 500, width: '100%'}}>
      <GoogleMapReact
        bootstrapURLKeys={{key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}}
        defaultCenter={{
          lat: address.lat,
          lng: address.lng,
        }}
        defaultZoom={15}
      >
        <Pin lat={address.lat} lng={address.lng} />
      </GoogleMapReact>
    </div>
  )
}

const Pin = ({text}) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    style={{width: 20, height: 20, marginLeft: -10, marginTop: -10}}
  >
    <Typography style={{fontSize: 40, color: 'black'}}>⚬</Typography>
  </Box>
)

const DeleteButton = (props) => {
  const router = hooks.useRouter()
  const client = hooks.useClient()
  const {address} = props
  const [open, setOpen] = React.useState(false)
  const [isDeleting, setDeleting] = React.useState(false)
  const handleClose = () => setOpen(false)

  return (
    <>
      {isDeleting ? (
        <CircularProgress />
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setOpen(true)
          }}
        >
          <FormattedMessage id="@t.delete@@" />
        </Button>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormattedMessage id="@t.delete_tenancy_confirmation@@" values={{address: address.name}} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            <FormattedMessage id="@t.cancel@@" />
          </Button>
          <Button
            onClick={() => {
              setDeleting(true)
              handleClose()
              client
                .mutate({mutation: DELETE_ADDRESS, variables: {id: address.id}})
                .then(() => {
                  router.push('/')
                })
                .catch((error) => {
                  utils.handleError(error)
                  setDeleting(false)
                })
            }}
            color="secondary"
            autoFocus
          >
            <FormattedMessage id="@t.delete@@" />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddressPage
