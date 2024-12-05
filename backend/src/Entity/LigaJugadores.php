<?php

namespace App\Entity;

use App\Repository\LigaJugadoresRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;

#[ApiResource]
#[ApiFilter(SearchFilter::class, properties: ['liga' => 'exact'])]
#[ORM\Entity(repositoryClass: LigaJugadoresRepository::class)]
class LigaJugadores
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'ligaJugadores')]
    private ?Liga $liga = null;

    #[ORM\ManyToOne(inversedBy: 'ligaJugadores')]
    private ?Jugadores $jugador = null;

    #[ORM\Column(nullable: true)]
    private ?int $puntos = null;

    #[ORM\Column(nullable: true)]
    private ?int $puntosTotales = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLiga(): ?Liga
    {
        return $this->liga;
    }

    public function setLiga(?Liga $liga): static
    {
        $this->liga = $liga;

        return $this;
    }

    public function getJugador(): ?Jugadores
    {
        return $this->jugador;
    }

    public function setJugador(?Jugadores $jugador): static
    {
        $this->jugador = $jugador;

        return $this;
    }

    public function getPuntos(): ?int
    {
        return $this->puntos;
    }

    public function setPuntos(?int $puntos): static
    {
        $this->puntos = $puntos;

        return $this;
    }

    public function getPuntosTotales(): ?int
    {
        return $this->puntosTotales;
    }

    public function setPuntosTotales(?int $puntosTotales): static
    {
        $this->puntosTotales = $puntosTotales;

        return $this;
    }
}
