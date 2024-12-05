<?php

namespace App\Entity;

use App\Repository\RolesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ApiResource]
#[ORM\Entity(repositoryClass: RolesRepository::class)]
class Roles
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    /**
     * @var Collection<int, Partida>
     */
    #[ORM\OneToMany(targetEntity: Partida::class, mappedBy: 'rol')]
    private Collection $partidas;

    public function __construct()
    {
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
            $partida->setRol($this);
        }

        return $this;
    }

    public function removePartida(Partida $partida): static
    {
        if ($this->partidas->removeElement($partida)) {
            // set the owning side to null (unless already changed)
            if ($partida->getRol() === $this) {
                $partida->setRol(null);
            }
        }

        return $this;
    }
    public function getPartidasTerminadas(): array
    {
        $partidasTerminadas = [];

        foreach ($this->partidas as $partida) {
            if ($partida->isTerminada()) {
                $partidasTerminadas[] = $partida;
            }
        }

        return $partidasTerminadas;
    }

    public function getPartidasPrimero(): array
    {
        $partidasPrimero = [];

        foreach ($this->partidas as $partida) {
            if ($partida->esPrimero()) {
                $partidasPrimero[] = $partida;
            }
        }

        return $partidasPrimero;
    }
    public function getPartidasSegundo(): array
    {
        $partidasSegundo = [];
    
        foreach ($this->partidas as $partida) {
            if ($partida->esSegundo()) {
                $partidasSegundo[] = $partida;
            }
        }
    
        return $partidasSegundo;
    }
    public function getPartidasTercero(): array
    {
        $partidasTercero = [];
    
        foreach ($this->partidas as $partida) {
            if ($partida->esTercero()) {
                $partidasTercero[] = $partida;
            }
        }
    
        return $partidasTercero;
    }
    public function getPartidasCuarto(): array
    {
        $partidasCuarto = [];
    
        foreach ($this->partidas as $partida) {
            if ($partida->esCuarto()) {
                $partidasCuarto[] = $partida;
            }
        }
    
        return $partidasCuarto;
    }
}