import { useEffect, useRef, useState } from 'react'

export type LocationTuple = [number, number]
export type RegionGroup = number[]

interface MapCanvasProps {
  locations: LocationTuple[]
  regions?: RegionGroup[]
  onRegionClick?: (regionIndex: number, nodeIndices: RegionGroup) => void
  highlightedRegion?: number | null
}

function getRegionPolygon(regionIndices: RegionGroup, locations: LocationTuple[]): LocationTuple[] {
  const points = regionIndices
    .map((index) => locations[index])
    .filter((point): point is LocationTuple => Array.isArray(point) && point.length >= 2)

  if (points.length < 3) {
    return points
  }

  const centroid: LocationTuple = [
    points.reduce((sum, point) => sum + point[0], 0) / points.length,
    points.reduce((sum, point) => sum + point[1], 0) / points.length,
  ]

  return [...points].sort((a, b) => {
    const angleA = Math.atan2(a[1] - centroid[1], a[0] - centroid[0])
    const angleB = Math.atan2(b[1] - centroid[1], b[0] - centroid[0])
    return angleA - angleB
  })
}

export function MapCanvas({
  locations,
  regions = [],
  onRegionClick,
  highlightedRegion = null,
}: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredRegion, setHoveredRegion] = useState<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const scale = Math.min(canvas.width, canvas.height) / 100
    const offsetX = (canvas.width - 100 * scale) / 2
    const offsetY = (canvas.height - 100 * scale) / 2

    const toCanvas = (coords: [number, number]): [number, number] => [
      coords[0] * scale + offsetX,
      coords[1] * scale + offsetY,
    ]

    regions.forEach((regionIndices, regionIndex) => {
      const polygon = getRegionPolygon(regionIndices, locations)
      if (polygon.length < 3) return

      ctx.beginPath()
      const [startX, startY] = toCanvas(polygon[0])
      ctx.moveTo(startX, startY)

      polygon.slice(1).forEach((coord) => {
        const [x, y] = toCanvas(coord)
        ctx.lineTo(x, y)
      })
      ctx.closePath()

      const isHovered = hoveredRegion === regionIndex
      const isHighlighted = highlightedRegion === regionIndex

      if (isHighlighted) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'
      } else if (isHovered) {
        ctx.fillStyle = 'rgba(100, 100, 100, 0.15)'
      } else {
        ctx.fillStyle = 'rgba(200, 200, 200, 0.1)'
      }
      ctx.fill()

      ctx.strokeStyle = isHighlighted ? 'rgba(59, 130, 246, 0.6)' : 'rgba(150, 150, 150, 0.4)'
      ctx.lineWidth = isHighlighted ? 3 : 2
      ctx.stroke()

      const centroid = polygon.reduce(
        (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
        [0, 0] as [number, number],
      ).map((v) => v / polygon.length) as [number, number]

      const [labelX, labelY] = toCanvas(centroid)
      ctx.fillStyle = '#666'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Region ${regionIndex + 1}`, labelX, labelY)
    })

    locations.forEach((location, locationIndex) => {
      const [x, y] = toCanvas(location)

      ctx.beginPath()
      ctx.arc(x, y, 7, 0, 2 * Math.PI)
      ctx.fillStyle = '#ef4444'
      ctx.fill()
      ctx.strokeStyle = '#991b1b'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = '#111'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`N${locationIndex + 1}`, x, y - 12)
    })
  }, [locations, regions, hoveredRegion, highlightedRegion])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onRegionClick || regions.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const scale = Math.min(canvas.width, canvas.height) / 100
    const offsetX = (canvas.width - 100 * scale) / 2
    const offsetY = (canvas.height - 100 * scale) / 2

    const logicalX = (x - offsetX) / scale
    const logicalY = (y - offsetY) / scale

    for (let regionIndex = 0; regionIndex < regions.length; regionIndex += 1) {
      const region = regions[regionIndex]
      const polygon = getRegionPolygon(region, locations)
      if (polygon.length < 3) continue

      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0]
        const yi = polygon[i][1]
        const xj = polygon[j][0]
        const yj = polygon[j][1]

        const intersect = ((yi > logicalY) !== (yj > logicalY))
          && (logicalX < (xj - xi) * (logicalY - yi) / (yj - yi) + xi)
        if (intersect) inside = !inside
      }

      if (inside) {
        onRegionClick(regionIndex, region)
        return
      }
    }
  }

  const handleCanvasHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (regions.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const scale = Math.min(canvas.width, canvas.height) / 100
    const offsetX = (canvas.width - 100 * scale) / 2
    const offsetY = (canvas.height - 100 * scale) / 2

    const logicalX = (x - offsetX) / scale
    const logicalY = (y - offsetY) / scale

    for (let regionIndex = 0; regionIndex < regions.length; regionIndex += 1) {
      const region = regions[regionIndex]
      const polygon = getRegionPolygon(region, locations)
      if (polygon.length < 3) continue

      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0]
        const yi = polygon[i][1]
        const xj = polygon[j][0]
        const yj = polygon[j][1]

        const intersect = ((yi > logicalY) !== (yj > logicalY))
          && (logicalX < (xj - xi) * (logicalY - yi) / (yj - yi) + xi)
        if (intersect) inside = !inside
      }

      if (inside) {
        setHoveredRegion(regionIndex)
        return
      }
    }

    setHoveredRegion(null)
  }

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="w-full h-full border border-gray-300 rounded-lg bg-gray-50 cursor-pointer"
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasHover}
      onMouseLeave={() => setHoveredRegion(null)}
    />
  )
}
