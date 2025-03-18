import React, { useState } from "react";
import { motion } from "framer-motion";
import DataSidebar from "./DataSidebar";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut, Maximize, Minimize } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface WorldMapInterfaceProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const WorldMapInterface: React.FC<WorldMapInterfaceProps> = ({
  isVisible = true,
  onClose = () => console.log("Close map interface"),
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("Global");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Mock regions for demonstration
  const regions = [
    { id: 1, name: "North America", coordinates: { lat: 40, lng: -100 } },
    { id: 2, name: "Europe", coordinates: { lat: 50, lng: 10 } },
    { id: 3, name: "Asia", coordinates: { lat: 30, lng: 100 } },
    { id: 4, name: "Africa", coordinates: { lat: 0, lng: 20 } },
    { id: 5, name: "South America", coordinates: { lat: -20, lng: -60 } },
    { id: 6, name: "Australia", coordinates: { lat: -25, lng: 135 } },
  ];

  const handleRegionSelect = (region: string) => {
    setIsLoading(true);
    setSelectedRegion(region);

    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for child elements
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className={`fixed inset-0 bg-white dark:bg-gray-950 ${isFullscreen ? "z-50" : "z-40"}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="h-full flex flex-col">
        {/* Header with controls */}
        <motion.div
          className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Back to Landing
            </Button>
            <h1 className="text-xl font-bold">Energy Load Forecasting Map</h1>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom in</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize className="h-4 w-4" />
                    ) : (
                      <Maximize className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map visualization */}
          <motion.div className="flex-1 relative" variants={itemVariants}>
            <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              {/* Flat Map visualization */}
              <div
                className="relative w-[80%] h-[70%] bg-blue-50 dark:bg-blue-900 border border-gray-300 dark:border-gray-700"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Simulated continents */}
                <div className="absolute top-[20%] left-[15%] w-[20%] h-[30%] bg-green-200 dark:bg-green-800"></div>
                <div className="absolute top-[25%] left-[40%] w-[25%] h-[20%] bg-green-200 dark:bg-green-800"></div>
                <div className="absolute top-[55%] left-[30%] w-[15%] h-[20%] bg-green-200 dark:bg-green-800"></div>
                <div className="absolute top-[60%] left-[70%] w-[15%] h-[15%] bg-green-200 dark:bg-green-800"></div>

                {/* Hotspots for regions */}
                {regions.map((region) => (
                  <Button
                    key={region.id}
                    variant="outline"
                    size="sm"
                    className={`absolute ${selectedRegion === region.name ? "bg-red-500 text-white" : "bg-white/80"}`}
                    style={{
                      top: `${50 - region.coordinates.lat * 0.7}%`,
                      left: `${50 + region.coordinates.lng * 0.4}%`,
                      transform: "translate(-50%, -50%)",
                      maxWidth: "120px",
                      fontSize: region.name.length > 10 ? "0.7rem" : "0.8rem",
                      padding: "4px 8px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => handleRegionSelect(region.name)}
                  >
                    {region.name}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Data sidebar */}
          <motion.div
            className="w-[350px] border-l border-gray-200 dark:border-gray-800"
            variants={itemVariants}
          >
            <DataSidebar
              regionName={selectedRegion}
              isLoading={isLoading}
              onRefresh={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
              }}
              onExport={() => console.log("Exporting data for", selectedRegion)}
              onFilterChange={(filter) =>
                console.log("Filter changed:", filter)
              }
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WorldMapInterface;
