import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

const PhoneModel3D = ({ phoneModel, design, position = { x: 0, y: 0, scale: 1, rotation: 0 } }) => {
  const phoneRef = useRef();
  const designRef = useRef();
  
  useFrame((state, delta) => {
    if (phoneRef.current && !design) {
      phoneRef.current.rotation.y += delta * 0.5;
    }
  });

  if (!phoneModel) {
    return (
      <group>
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#a855f7"
          anchorX="center"
          anchorY="middle"
        >
          Selecione um modelo
        </Text>
      </group>
    );
  }

  const phoneColor = phoneModel.id.includes('iphone') ? '#1a1a1a' : '#2a2a2a';
  const dimensions = phoneModel.dimensions || { width: 77, height: 158, thickness: 8 };
  
  // Scale phone to fit in scene
  const scale = 0.03;
  const phoneWidth = dimensions.width * scale;
  const phoneHeight = dimensions.height * scale;
  const phoneDepth = dimensions.thickness * scale;

  return (
    <group ref={phoneRef}>
      {/* Phone body */}
      <Box
        position={[0, 0, 0]}
        args={[phoneWidth, phoneHeight, phoneDepth]}
        material-color={phoneColor}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={phoneColor} 
          roughness={0.1}
          metalness={0.8}
        />
      </Box>

      {/* Screen */}
      <Box
        position={[0, 0, phoneDepth/2 + 0.01]}
        args={[phoneWidth * 0.85, phoneHeight * 0.9, 0.02]}
      >
        <meshStandardMaterial 
          color="#000000"
          roughness={0.0}
          metalness={0.0}
          emissive="#111111"
        />
      </Box>

      {/* Camera bump (for iPhones) */}
      {phoneModel.id.includes('iphone') && (
        <Box
          position={[-phoneWidth * 0.25, phoneHeight * 0.3, -phoneDepth/2 - 0.03]}
          args={[phoneWidth * 0.25, phoneWidth * 0.25, 0.06]}
        >
          <meshStandardMaterial 
            color={phoneColor}
            roughness={0.1}
            metalness={0.8}
          />
        </Box>
      )}

      {/* Design overlay */}
      {design && (
        <group ref={designRef}>
          {/* Background for the design */}
          <Box
            position={[
              position.x * 0.01, 
              position.y * 0.01, 
              -phoneDepth/2 - 0.001
            ]}
            args={[
              phoneWidth * 0.9 * position.scale, 
              phoneHeight * 0.85 * position.scale, 
              0.005
            ]}
            rotation={[0, 0, (position.rotation * Math.PI) / 180]}
          >
            <meshStandardMaterial 
              color="#ffffff"
              transparent
              opacity={0.9}
              roughness={0.8}
              metalness={0.1}
            />
          </Box>
          
          {/* Design pattern simulation */}
          <Box
            position={[
              position.x * 0.01, 
              position.y * 0.01, 
              -phoneDepth/2 - 0.002
            ]}
            args={[
              phoneWidth * 0.7 * position.scale, 
              phoneHeight * 0.6 * position.scale, 
              0.003
            ]}
            rotation={[0, 0, (position.rotation * Math.PI) / 180]}
          >
            <meshStandardMaterial 
              color="#8b5cf6"
              transparent
              opacity={0.8}
              roughness={0.3}
              metalness={0.2}
            />
          </Box>
          
          {/* Additional design elements based on design type */}
          {design.id === 'hearts-floating' && (
            <>
              {[...Array(5)].map((_, i) => (
                <Box
                  key={i}
                  position={[
                    (Math.random() - 0.5) * phoneWidth * 0.6 * position.scale + position.x * 0.01,
                    (Math.random() - 0.5) * phoneHeight * 0.5 * position.scale + position.y * 0.01,
                    -phoneDepth/2 - 0.003 - i * 0.001
                  ]}
                  args={[0.1, 0.1, 0.002]}
                  rotation={[0, 0, Math.random() * Math.PI]}
                >
                  <meshStandardMaterial 
                    color="#ec4899"
                    transparent
                    opacity={0.9}
                    emissive="#ec4899"
                    emissiveIntensity={0.2}
                  />
                </Box>
              ))}
            </>
          )}
          
          {design.id === 'geometric-modern' && (
            <>
              {[...Array(8)].map((_, i) => (
                <Box
                  key={i}
                  position={[
                    (i % 4 - 1.5) * 0.3 * position.scale + position.x * 0.01,
                    (Math.floor(i / 4) - 0.5) * 0.6 * position.scale + position.y * 0.01,
                    -phoneDepth/2 - 0.003 - (i % 3) * 0.001
                  ]}
                  args={[0.08, 0.08, 0.002]}
                  rotation={[0, 0, (position.rotation + i * 45) * Math.PI / 180]}
                >
                  <meshStandardMaterial 
                    color={i % 2 === 0 ? "#06d6a0" : "#f72585"}
                    transparent
                    opacity={0.8}
                    metalness={0.3}
                  />
                </Box>
              ))}
            </>
          )}
        </group>
      )}

      {/* Phone brand text */}
      <Text
        position={[0, -phoneHeight * 0.4, -phoneDepth/2 - 0.001]}
        fontSize={phoneWidth * 0.1}
        color="#666666"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]}
      >
        {phoneModel.brand}
      </Text>
    </group>
  );
};

export default PhoneModel3D;