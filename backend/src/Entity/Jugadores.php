<?php

namespace App\Entity;

use App\Repository\JugadoresRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ApiResource]
#[ORM\Entity(repositoryClass: JugadoresRepository::class)]
class Jugadores
{
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'jugadores')]
    private ?User $creator = null;

    /**
     * @var Collection<int, LigaJugadores>
     */
    #[ORM\OneToMany(targetEntity: LigaJugadores::class, mappedBy: 'jugador')]
    private Collection $ligaJugadores;

    /**
     * @var Collection<int, Partida>
     */
    #[ORM\OneToMany(targetEntity: Partida::class, mappedBy: 'jugador')]
    private Collection $partidas;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    public function __construct()
    {
        $this->ligaJugadores = new ArrayCollection();
        $this->partidas = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): static
    {
        $this->creator = $creator;

        return $this;
    }

    /**
     * @return Collection<int, LigaJugadores>
     */
    public function getLigaJugadores(): Collection
    {
        return $this->ligaJugadores;
    }

    public function addLigaJugadore(LigaJugadores $ligaJugadore): static
    {
        if (!$this->ligaJugadores->contains($ligaJugadore)) {
            $this->ligaJugadores->add($ligaJugadore);
            $ligaJugadore->setJugador($this);
        }

        return $this;
    }

    public function removeLigaJugadore(LigaJugadores $ligaJugadore): static
    {
        if ($this->ligaJugadores->removeElement($ligaJugadore)) {
            // set the owning side to null (unless already changed)
            if ($ligaJugadore->getJugador() === $this) {
                $ligaJugadore->setJugador(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Partida>
     */
    public function getPartidas(): Collection
    {
        return $this->partidas;
    }

    public function addPartida(Partida $partida): static
    {
        if (!$this->partidas->contains($partida)) {
            $this->partidas->add($partida);
            $partida->setJugador($this);
        }

        return $this;
    }

    public function removePartida(Partida $partida): static
    {
        if ($this->partidas->removeElement($partida)) {
            // set the owning side to null (unless already changed)
            if ($partida->getJugador() === $this) {
                $partida->setJugador(null);
            }
        }

        return $this;
    }
    public function getResultadosPartidasTerminadas(): array
    {
        $resultadosPartidasTerminadas = [];

        foreach ($this->partidas as $partida) {
            if ($partida->isTerminada()) {
                $resultado = [
                    'jornada' => $partida->getLiga() ? $partida->getJornada() : null ,
                    'rol' => $partida->getRol()->getName(),
                    'rolId' => $partida->getRol()->getId(),
                    'posicion' => $partida->getPosicion(),
                    'puntos' => $partida->getPuntos(),
                    'dominancia' => $partida->isDominancia() ? 'Sí' : 'No',
                    'liga' => $partida->getLiga() ? $partida->getLiga()->getId() : null, // Comprobación de null
                ];
                    $resultadosPartidasTerminadas[] = $resultado;
            }
        }

        return $resultadosPartidasTerminadas;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

}
