import { hostService } from '@/services/hostService'
import { Property } from '@/types/property'
import React, { useEffect, useState } from 'react'

const useHost = () => {
    const [properties, setProperties] = useState<Property[]>([])

    useEffect(()=>{
        const fetchHostProperties = async () => {
            try {
                const response = await hostService.getHostProperties();
                console.log("Fetched properties:", response);
                setProperties(response);
            } catch (error) {
                console.error("Error fetching properties:", error instanceof Error ? error.message : error);
            }
        }
        fetchHostProperties();
    }, []);

  return {
    properties
  }
};

export default useHost;