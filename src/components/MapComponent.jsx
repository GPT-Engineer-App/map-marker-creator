import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure } from '@chakra-ui/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, onDragEnd }) => {
  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (event) => {
          const marker = event.target;
          const newPosition = marker.getLatLng();
          onDragEnd(newPosition);
        },
      }}
    />
  );
};

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [newMarkerName, setNewMarkerName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        setNewMarkerPosition(event.latlng);
        onOpen();
      },
    });
    return null;
  };

  const handleAddMarker = () => {
    setMarkers([...markers, { position: newMarkerPosition, name: newMarkerName }]);
    setNewMarkerPosition(null);
    setNewMarkerName('');
    onClose();
  };

  const handleMarkerDragEnd = (index, newPosition) => {
    const updatedMarkers = markers.map((marker, i) => (i === index ? { ...marker, position: newPosition } : marker));
    setMarkers(updatedMarkers);
  };

  return (
    <Box height="100vh" width="100%">
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {markers.map((marker, index) => (
          <LocationMarker
            key={index}
            position={marker.position}
            onDragEnd={(newPosition) => handleMarkerDragEnd(index, newPosition)}
          />
        ))}
      </MapContainer>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter location name"
              value={newMarkerName}
              onChange={(e) => setNewMarkerName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddMarker}>
              Add
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MapComponent;