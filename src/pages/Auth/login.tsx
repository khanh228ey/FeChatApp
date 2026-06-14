import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { loginApi } from '../../api/auth'
import { useAuthStore } from '../../stores/authStore'
import type { ApiError } from '../../types/auth'
import { isAxiosError } from 'axios'

export default function LoginPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const navigate = useNavigate()
    const login = useAuthStore((s) => s.login)
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        document.body.style.margin = '0'
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'

        const canvas = canvasRef.current
        if (!canvas) return

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x87ceeb)
        scene.fog = new THREE.Fog(0xc9e8f5, 80, 220)

        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500)
        camera.position.set(0, 3, 0)
        camera.rotation.x = -0.18

        // Lights
        const sun = new THREE.DirectionalLight(0xfffbe6, 2.2)
        sun.position.set(30, 80, 40)
        sun.castShadow = true
        sun.shadow.mapSize.set(2048, 2048)
        sun.shadow.camera.far = 300
        sun.shadow.camera.left = -80
        sun.shadow.camera.right = 80
        sun.shadow.camera.top = 80
        sun.shadow.camera.bottom = -80
        scene.add(sun)
        scene.add(new THREE.AmbientLight(0xfff5d6, 1.4))
        scene.add(new THREE.HemisphereLight(0x87ceeb, 0x6dbb4a, 0.6))

        // Sun disc
        const sunDisc = new THREE.Mesh(
            new THREE.SphereGeometry(6, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xfffbe0 })
        )
        sunDisc.position.set(60, 90, -150)
        scene.add(sunDisc)

        // Clouds
        const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 })
        const clouds: THREE.Group[] = []
        for (let i = 0; i < 18; i++) {
            const g = new THREE.Group()
            const count = 4 + Math.floor(Math.random() * 4)
            for (let j = 0; j < count; j++) {
                const r = 3 + Math.random() * 4
                const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 7, 7), cloudMat)
                puff.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 6)
                puff.scale.y = 0.55
                g.add(puff)
            }
            g.position.set((Math.random() - 0.5) * 260, 28 + Math.random() * 20, -40 - Math.random() * 160)
            scene.add(g)
            clouds.push(g)
        }

        // Ground
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(600, 600),
            new THREE.MeshLambertMaterial({ color: 0x6dbb4a })
        )
        ground.rotation.x = -Math.PI / 2
        ground.position.y = -0.5
        ground.receiveShadow = true
        scene.add(ground)

        // Grass tiles — infinite loop
        const TILE_SIZE = 12
        const TILE_COLS = 9
        const TILE_ROWS = 10
        const BLADES = 120
        const TOTAL_DEPTH = TILE_ROWS * TILE_SIZE

        const bladeGeo = new THREE.BufferGeometry()
        bladeGeo.setAttribute('position', new THREE.Float32BufferAttribute(
            new Float32Array([-0.04, 0, 0, 0.04, 0, 0, 0, 0.6, 0]), 3
        ))

        const makeGrassColor = () => {
            const c = new THREE.Color()
            c.setHSL(0.28 + (Math.random() - 0.5) * 0.06, 0.55 + Math.random() * 0.2, 0.38 + Math.random() * 0.15)
            return c
        }

        const dummy = new THREE.Object3D()
        type Tile = { mesh: THREE.InstancedMesh; tileCol: number }
        const tiles: Tile[] = []

        for (let row = 0; row < TILE_ROWS; row++) {
            for (let col = 0; col < TILE_COLS; col++) {
                const mat = new THREE.MeshBasicMaterial({ color: makeGrassColor(), side: THREE.DoubleSide })
                const mesh = new THREE.InstancedMesh(bladeGeo, mat, BLADES)
                for (let b = 0; b < BLADES; b++) {
                    dummy.position.set((Math.random() - 0.5) * TILE_SIZE, -0.5, (Math.random() - 0.5) * TILE_SIZE)
                    const s = 0.7 + Math.random() * 1.1
                    dummy.scale.set(s, s, s)
                    dummy.rotation.y = Math.random() * Math.PI * 2
                    dummy.updateMatrix()
                    mesh.setMatrixAt(b, dummy.matrix)
                }
                mesh.instanceMatrix.needsUpdate = true
                const colOffset = (col - Math.floor(TILE_COLS / 2)) * TILE_SIZE
                mesh.position.set(colOffset, 0, -row * TILE_SIZE)
                scene.add(mesh)
                tiles.push({ mesh, tileCol: col })
            }
        }

        // Trees
        type TreeObj = { group: THREE.Group }
        const trees: TreeObj[] = []
        const makeTree = (x: number, z: number) => {
            const g = new THREE.Group()
            const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.12, 0.18, 2.5, 6),
                new THREE.MeshLambertMaterial({ color: 0x8b5e3c })
            )
            trunk.position.y = 1.25
            trunk.castShadow = true
            g.add(trunk)
            const colors = [0x4caf50, 0x66bb6a, 0x81c784]
            for (let i = 0; i < 3; i++) {
                const cone = new THREE.Mesh(
                    new THREE.ConeGeometry(1.6 - i * 0.3, 2.2, 8),
                    new THREE.MeshLambertMaterial({ color: colors[i] })
                )
                cone.position.y = 2.5 + i * 1.5
                cone.castShadow = true
                g.add(cone)
            }
            g.position.set(x, -0.5, z)
            scene.add(g)
            trees.push({ group: g })
        }
        for (let i = 0; i < 24; i++) {
            const z = -5 - i * 8
            const side = Math.random() > 0.5 ? 1 : -1
            makeTree(side * (14 + Math.random() * 18), z)
            if (Math.random() > 0.6) makeTree((Math.random() - 0.5) * 30, z - 4)
        }

        // Flowers
        const flowerColors = [0xff6b6b, 0xffd93d, 0xff8fab, 0xc77dff, 0x4cc9f0]
        type FlowerObj = { head: THREE.Mesh; stem: THREE.Mesh }
        const flowers: FlowerObj[] = []
        for (let i = 0; i < 120; i++) {
            const x = (Math.random() - 0.5) * 60
            const z = -Math.random() * 120
            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, 0.5, 4),
                new THREE.MeshBasicMaterial({ color: 0x4a8c2a })
            )
            const head = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 6, 6),
                new THREE.MeshBasicMaterial({ color: flowerColors[Math.floor(Math.random() * flowerColors.length)] })
            )
            stem.position.set(x, -0.25, z)
            head.position.set(x, 0.0, z)
            scene.add(stem)
            scene.add(head)
            flowers.push({ head, stem })
        }

        // Dirt path
        const pathMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2.5, 600),
            new THREE.MeshLambertMaterial({ color: 0xd4a96a })
        )
        pathMesh.rotation.x = -Math.PI / 2
        pathMesh.position.set(0, -0.48, -200)
        scene.add(pathMesh)

        // Animation loop
        const SPEED = 14
        let lastTime = performance.now()
        let animId: number

        const animate = () => {
            animId = requestAnimationFrame(animate)
            const now = performance.now()
            const dt = Math.min((now - lastTime) / 1000, 0.05)
            lastTime = now
            const move = SPEED * dt

            // Recycle grass tiles
            tiles.forEach(({ mesh, tileCol }) => {
                mesh.position.z += move
                if (mesh.position.z > 4) {
                    mesh.position.z -= TOTAL_DEPTH
                        ; (mesh.material as THREE.MeshBasicMaterial).color = makeGrassColor()
                }
                mesh.position.x = (tileCol - Math.floor(TILE_COLS / 2)) * TILE_SIZE
            })

            // Recycle trees
            trees.forEach(t => {
                t.group.position.z += move
                if (t.group.position.z > 8) {
                    t.group.position.z -= 200
                    t.group.position.x = (Math.random() > 0.5 ? 1 : -1) * (14 + Math.random() * 18)
                }
            })

            // Recycle flowers
            flowers.forEach(f => {
                f.head.position.z += move
                f.stem.position.z += move
                if (f.head.position.z > 4) {
                    const newZ = f.head.position.z - 120
                    const newX = (Math.random() - 0.5) * 60
                    f.head.position.set(newX, 0.0, newZ)
                    f.stem.position.set(newX, -0.25, newZ)
                }
            })

            // Drift clouds
            clouds.forEach(c => {
                c.position.x += 0.018
                if (c.position.x > 140) c.position.x = -140
            })

            // Gentle camera sway
            const t = now * 0.0004
            camera.position.x = Math.sin(t * 0.7) * 0.3
            camera.position.y = 3 + Math.sin(t) * 0.08

            renderer.render(scene, camera)
        }
        animate()

        const onResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight)
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
        }
        window.addEventListener('resize', onResize)

        return () => {
            cancelAnimationFrame(animId)
            renderer.dispose()
            window.removeEventListener('resize', onResize)
            document.body.style.overflow = ''
            document.body.style.margin = ''
            document.documentElement.style.overflow = ''
        }
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const result = await loginApi({ identifier, password })
            login(result.token, result.user)
            navigate('/hello')
        } catch (err) {
            if (isAxiosError<ApiError>(err)) {
                setError(err.response?.data?.error ?? 'Đăng nhập thất bại')
            } else {
                setError('Không thể kết nối server')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none',
            }}>
                <form
                    onSubmit={handleLogin}
                    style={{
                        pointerEvents: 'all',
                        background: 'rgba(255,255,255,0.55)',
                        backdropFilter: 'blur(22px)',
                        WebkitBackdropFilter: 'blur(22px)',
                        border: '1px solid rgba(255,255,255,0.75)',
                        borderRadius: '24px',
                        padding: '44px 40px',
                        width: '360px',
                        boxShadow: '0 12px 48px rgba(80,140,60,0.18), 0 2px 8px rgba(0,0,0,0.08)',
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: '16px',
                            background: 'linear-gradient(135deg, #56ab2f, #a8e063)',
                            margin: '0 auto 14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 26,
                            boxShadow: '0 4px 16px rgba(86,171,47,0.35)',
                        }}>🌿</div>
                        <h2 style={{ color: '#2d5a1b', fontSize: 23, fontWeight: 700, margin: 0, letterSpacing: '-0.3px' }}>
                            Chào mừng
                        </h2>
                        <p style={{ color: '#6a9c4f', fontSize: 13, margin: '6px 0 0' }}>
                            Đăng nhập để tiếp tục
                        </p>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                        <label style={{ color: '#4a7a35', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                            Email hoặc SĐT
                        </label>
                        <input
                            type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
                            placeholder="you@example.com hoặc 0901234567" required
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                background: 'rgba(255,255,255,0.7)',
                                border: '1.5px solid rgba(86,171,47,0.3)',
                                borderRadius: 12, padding: '12px 14px',
                                color: '#2d4a1e', fontSize: 14, outline: 'none',
                            }}
                            onFocus={e => (e.target.style.borderColor = '#56ab2f')}
                            onBlur={e => (e.target.style.borderColor = 'rgba(86,171,47,0.3)')}
                        />
                    </div>

                    <div style={{ marginBottom: 22 }}>
                        <label style={{ color: '#4a7a35', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                            Mật khẩu
                        </label>
                        <input
                            type="password" value={password} onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••" required
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                background: 'rgba(255,255,255,0.7)',
                                border: '1.5px solid rgba(86,171,47,0.3)',
                                borderRadius: 12, padding: '12px 14px',
                                color: '#2d4a1e', fontSize: 14, outline: 'none',
                            }}
                            onFocus={e => (e.target.style.borderColor = '#56ab2f')}
                            onBlur={e => (e.target.style.borderColor = 'rgba(86,171,47,0.3)')}
                        />
                    </div>

                    {error && (
                        <p style={{
                            color: '#c0392b', fontSize: 13, textAlign: 'center',
                            margin: '0 0 14px', background: 'rgba(192,57,43,0.08)',
                            borderRadius: 8, padding: '8px 12px',
                        }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit" disabled={loading}
                        style={{
                            width: '100%', padding: '13px',
                            borderRadius: 12, border: 'none',
                            background: loading ? 'rgba(86,171,47,0.4)' : 'linear-gradient(135deg, #56ab2f, #a8e063)',
                            color: '#fff', fontSize: 15, fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: loading ? 'none' : '0 4px 16px rgba(86,171,47,0.4)',
                            letterSpacing: '0.2px',
                        }}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập →'}
                    </button>

                    <p style={{ color: '#8ab87a', fontSize: 11, textAlign: 'center', marginTop: 18 }}>
                        🌾 Đồng cỏ vô tận đang chờ bạn
                    </p>
                </form>
            </div>
        </div>
    )
}