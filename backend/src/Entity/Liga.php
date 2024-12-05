<?php

namespace App\Entity;

use App\Repository\LigaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ApiResource]
#[ORM\Entity(repositoryClass: LigaRepository::class)]
class Liga
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column]
    private ?int $jornadas = null;

    /**
     * @var Collection<int, LigaJugadores>
     */
    #[ORM\OneToMany(targetEntity: LigaJugadores::class, mappedBy: 'liga')]
    private Collection $ligaJugadores;

    /**
     * @var Collection<int, Partida>
     */
    #[ORM\OneToMany(targetEntity: Partida::class, mappedBy: 'liga')]
    private Collection $partidas;

    #[ORM\Column]
    private ?bool $terminada = null;

    #[ORM\ManyToOne(inversedBy: 'ligas')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $creador = null;

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

    public function getJornadas(): ?int
    {
        return $this->jornadas;
    }

    public function setJornadas(int $jornadas): static
    {
        $this->jornadas = $jornadas;

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
            $ligaJugadore->setLiga($this);
        }

        return $this;
    }

    public function removeLigaJugadore(LigaJugadores $ligaJugadore): static
    {
        if ($this->ligaJugadores->removeElement($ligaJugadore)) {
            if ($ligaJugadore->getLiga() === $this) {
                $ligaJugadore->setLiga(null);
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
            $partida->setLiga($this);
        }

        return $this;
    }

    public function removePartida(Partida $partida): static
    {
        if ($this->partidas->removeElement($partida)) {
            // set the owning side to null (unless already changed)
            if ($partida->getLiga() === $this) {
                $partida->setLiga(null);
            }
        }

        return $this;
    }

    public function isTerminada(): ?bool
    {
        return $this->terminada;
    }

    public function setTerminada(bool $terminada): static
    {
        $this->terminada = $terminada;

        return $this;
    }

    public function getCreador(): ?User
    {
        return $this->creador;
    }

    public function setCreador(?User $creador): static
    {
        $this->creador = $creador;

        return $this;
    }
    public function getPartidasPrimeraJornadaNoTerminada(): ?array
{

    $partidasPorJornada = [];

    foreach ($this->partidas as $partida) {
        if (!$partida->isTerminada()) {
            $partidasPorJornada[$partida->getJornada()][] = $partida;
        }
    }

    ksort($partidasPorJornada);

    foreach ($partidasPorJornada as $jornada => $partidas) {
        if (count($partidas) >= 4) {
            return array_slice($partidas, 0, 4); 
        }
    }

    return null; 
}
}
